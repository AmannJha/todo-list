# Day-Mark

A calm, focused to-do list for gathering tasks and bringing them to a close.

## Features

- Add, complete, and delete tasks
- Filter tasks by all, open, or done
- Clear completed tasks
- Track completion progress
- Persist tasks in the browser with local storage
- Responsive layout for desktop and mobile

## Getting Started

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually `http://localhost:5173/`.

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## Project Structure

```text
.
├── index.html          # App entry point
├── src/
│   ├── main.js         # Task state and interactions
│   └── style.css       # Layout, styling, and responsive rules
├── package.json        # Project metadata and scripts
└── README.md           # Project documentation
```

## Data Storage

Tasks are saved under the `daymark-tasks` key in the browser's local storage. Clearing site data or using a different browser will create a separate task list.
