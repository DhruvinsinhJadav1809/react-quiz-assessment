# React Developer Assessment

Vite + React + TypeScript quiz app: topic/difficulty filters, timed questions with instant
explanations, a results report, and an overall summary with charts (history is stored in localStorage).

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Add questions
Append objects to `src/data/questions.json` using the same schema (id, topic, subtopic, difficulty,
questionType, question, code, options A–D, correctAnswer, explanation). Topics, filters, counts and charts
update automatically. Options are shuffled on every attempt, so the correct letter in the file doesn't matter.

## Structure
```
src/
  App.tsx              view switching + attempt history
  types.ts             shared types
  utils.ts             shuffle, formatting, breakdown helpers, storage
  data/questions.json  question bank
  components/          Home, Quiz, Results, Summary, Charts
```
