import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
};

export interface ChatState {
  messages: ChatMessage[];
  confusionScore: number;
  currentStreak: number;
  bestStreak: number;
  leaderboard: { userId: string; bestStreak: number }[];
  history: { duration: number; endedAt: string; topic: string }[];
  summary: {
    totalSessions: number;
    totalDuration: number;
    bestStreak: number;
    avgDuration: number;
    lastActive: string | null;
  } | null;

  // New session state
  selectedTopic: string | null;
  sessionStatus: 'selecting' | 'active' | 'ended';
  responseDeadline: string | null; // ISO timestamp
}

const initialState: ChatState = {
  messages: [],
  confusionScore: 0,
  currentStreak: 0,
  bestStreak: 0,
  leaderboard: [],
  history: [],
  summary: null,
  selectedTopic: null,
  sessionStatus: 'selecting',
  responseDeadline: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setTopic(state, action: PayloadAction<string>) {
      state.selectedTopic = action.payload;
    },
    startSession(state) {
      state.sessionStatus = 'active';
      state.messages = [];
      state.confusionScore = 0;
      state.currentStreak = 0;
    },
    endSession(state) {
      state.sessionStatus = 'ended';
      state.responseDeadline = null;
    },
    setResponseDeadline(state, action: PayloadAction<string | null>) {
      state.responseDeadline = action.payload;
    },
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    setConfusionScore(state, action: PayloadAction<number>) {
      state.confusionScore = action.payload;
    },
    tickStreak(state) {
      if (state.sessionStatus === 'active' && state.confusionScore < 45) {
        state.currentStreak += 1;
        if (state.currentStreak > state.bestStreak) {
          state.bestStreak = state.currentStreak;
        }
      } else if (state.sessionStatus === 'active' && state.confusionScore >= 45) {
        state.currentStreak = 0;
      }
    },
    setLeaderboard(state, action: PayloadAction<{ userId: string; bestStreak: number }[]>) {
      state.leaderboard = action.payload;
    },
    setHistory(state, action: PayloadAction<{ duration: number; endedAt: string; topic: string }[]>) {
      state.history = action.payload;
    },
    setSummary(state, action: PayloadAction<ChatState['summary']>) {
      state.summary = action.payload;
    },
    resetChat(state) {
      state.messages = [];
      state.confusionScore = 0;
      state.currentStreak = 0;
      state.sessionStatus = 'selecting';
      state.selectedTopic = null;
      state.responseDeadline = null;
    },
  },
});

export const {
  setTopic,
  startSession,
  endSession,
  setResponseDeadline,
  addMessage,
  setConfusionScore,
  tickStreak,
  setLeaderboard,
  setHistory,
  setSummary,
  resetChat
} = chatSlice.actions;
export default chatSlice.reducer;
