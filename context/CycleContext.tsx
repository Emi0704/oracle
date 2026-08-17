import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { CycleData, PeriodEntry, SymptomEntry, FlowLevel, SymptomType } from '../types/cycle';
import { loadCycleData, saveCycleData, mergeWithDefaults } from '../lib/storage';
import { getColors, ThemeColors } from '../constants/theme';

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

interface CycleState {
  data: CycleData;
  isLoading: boolean;
}

type CycleAction =
  | { type: 'SET_DATA'; payload: CycleData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_PERIOD'; payload: PeriodEntry }
  | { type: 'UPDATE_PERIOD'; payload: PeriodEntry }
  | { type: 'DELETE_PERIOD'; payload: string }
  | { type: 'ADD_SYMPTOMS'; payload: SymptomEntry }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<CycleData['settings']> };

function cycleReducer(state: CycleState, action: CycleAction): CycleState {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_PERIOD':
      return {
        ...state,
        data: {
          ...state.data,
          periods: [...state.data.periods, action.payload].sort(
            (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          ),
        },
      };
    case 'UPDATE_PERIOD':
      return {
        ...state,
        data: {
          ...state.data,
          periods: state.data.periods
            .map((p) => (p.id === action.payload.id ? action.payload : p))
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
        },
      };
    case 'DELETE_PERIOD':
      return {
        ...state,
        data: {
          ...state.data,
          periods: state.data.periods.filter((p) => p.id !== action.payload),
        },
      };
    case 'ADD_SYMPTOMS': {
      const existing = state.data.symptoms.findIndex((s) => s.date === action.payload.date);
      const symptoms = [...state.data.symptoms];
      if (existing >= 0) {
        symptoms[existing] = action.payload;
      } else {
        symptoms.push(action.payload);
      }
      return { ...state, data: { ...state.data, symptoms } };
    }
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        data: {
          ...state.data,
          settings: { ...state.data.settings, ...action.payload },
        },
      };
    default:
      return state;
  }
}

interface CycleContextValue {
  data: CycleData;
  isLoading: boolean;
  colors: ThemeColors;
  addPeriod: (startDate: string, endDate?: string, flowIntensity?: FlowLevel[]) => void;
  updatePeriod: (period: PeriodEntry) => void;
  deletePeriod: (id: string) => void;
  logSymptoms: (date: string, symptoms: SymptomType[], notes?: string) => void;
  updateSettings: (settings: Partial<CycleData['settings']>) => void;
  restoreData: (data: CycleData) => void;
}

const CycleContext = createContext<CycleContextValue | null>(null);

const DEFAULT_SETTINGS = {
  defaultCycleLength: 28,
  defaultPeriodLength: 5,
  themeMode: 'dark' as const,
  trackingMode: 'normal' as const,
};

export function CycleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cycleReducer, {
    data: { periods: [], symptoms: [], settings: DEFAULT_SETTINGS },
    isLoading: true,
  });

  const colors = useMemo(() => getColors(state.data.settings.themeMode), [state.data.settings.themeMode]);

  useEffect(() => {
    loadCycleData().then((data) => {
      dispatch({ type: 'SET_DATA', payload: data });
    });
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      saveCycleData(state.data);
    }
  }, [state.data, state.isLoading]);

  const addPeriod = useCallback((startDate: string, endDate?: string, flowIntensity?: FlowLevel[]) => {
    const period: PeriodEntry = {
      id: generateId(),
      startDate,
      endDate: endDate || null,
      flowIntensity: flowIntensity || [],
    };
    dispatch({ type: 'ADD_PERIOD', payload: period });
  }, []);

  const updatePeriod = useCallback((period: PeriodEntry) => {
    dispatch({ type: 'UPDATE_PERIOD', payload: period });
  }, []);

  const deletePeriod = useCallback((id: string) => {
    dispatch({ type: 'DELETE_PERIOD', payload: id });
  }, []);

  const logSymptoms = useCallback((date: string, symptoms: SymptomType[], notes?: string) => {
    dispatch({ type: 'ADD_SYMPTOMS', payload: { date, symptoms, notes } });
  }, []);

  const updateSettings = useCallback((settings: Partial<CycleData['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const restoreData = useCallback((data: CycleData) => {
    dispatch({ type: 'SET_DATA', payload: mergeWithDefaults(data) });
  }, []);

  return (
    <CycleContext.Provider
      value={{
        data: state.data,
        isLoading: state.isLoading,
        colors,
        addPeriod,
        updatePeriod,
        deletePeriod,
        logSymptoms,
        updateSettings,
        restoreData,
      }}
    >
      {children}
    </CycleContext.Provider>
  );
}

export function useCycle() {
  const context = useContext(CycleContext);
  if (!context) {
    throw new Error('useCycle must be used within a CycleProvider');
  }
  return context;
}
