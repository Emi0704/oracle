# Oracle - The Grimoire

A witchy, tarot-themed period tracker app built with React Native (Expo).

## Features

- **Oracle (Home)** - Calendar view with color-coded cycle days, predictions, fertile windows, moon phase decorations, and inline period/symptom logging (including a forecast card for future dates)
- **Visions (Insights)** - Cycle phase info styled as tarot readings, ovulation/fertility tracking, pregnancy chance indicators
- **Codex (Info)** - Cycle myths & truths, symptom and cycle glossaries, phase self-care rituals, and signs worth flagging to a doctor
- **Mirror (Compare)** - Compare your cycle stats against a "textbook" 28-day cycle with visual charts
- **Settings** - Light/dark mode, and three tracking modes (just tracking, trying to conceive, avoiding pregnancy)
- **Backup & Restore** - Export your data as a file to save in Google Drive, iCloud, or elsewhere, and restore it later

## Tech Stack

- React Native + Expo (SDK 54)
- TypeScript
- Expo Router (file-based navigation)
- expo-file-system (local JSON storage)
- react-native-calendars
- react-native-svg (icons & charts)

## Getting Started

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS) to run on your device.

## Data Storage

All data is stored locally on-device in a JSON file. Nothing leaves your phone unless you use the Backup & Restore feature to export it yourself.

## Cycle Predictions

- With < 3 cycles: assumes a standard 28-day cycle
- With 3+ cycles: uses a weighted moving average (recent cycles weigh more heavily)
- Ovulation estimated at 14 days before next predicted period
- Fertile window: 5 days before ovulation through ovulation day
