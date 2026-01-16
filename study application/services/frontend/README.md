# Frontend Service

React + TypeScript + Vite frontend for the Study Application platform.

## Features

- 🎨 Modern, beautiful UI with glassmorphism and gradients
- 🔐 JWT-based authentication
- 💬 Real-time chat with Socket.IO
- 📊 Live confusion score meter
- 🎯 Redux Toolkit for state management
- ✅ Comprehensive test coverage with Vitest

## Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
VITE_GATEWAY_URL=http://localhost:4000
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3001`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Testing

```bash
npm test
```

## Project Structure

```
src/
├── components/       # React components
│   ├── ChatInput.tsx
│   ├── ChatMessage.tsx
│   ├── ChatWindow.tsx
│   ├── ConfusionMeter.tsx
│   ├── Header.tsx
│   └── LoginForm.tsx
├── hooks/           # Custom React hooks
│   ├── useAuth.ts
│   └── useSocket.ts
├── store/           # Redux store
│   ├── chatSlice.ts
│   ├── hooks.ts
│   └── index.ts
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── styles.css       # Global styles
```

## Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **Socket.IO Client** - Real-time communication
- **Vitest** - Testing framework
- **Testing Library** - Component testing
