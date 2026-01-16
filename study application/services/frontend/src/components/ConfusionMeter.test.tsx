import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../store/chatSlice";
import { ConfusionMeter } from "../components/ConfusionMeter";

const createMockStore = (confusionScore: number) => {
    return configureStore({
        reducer: {
            chat: chatReducer,
        },
        preloadedState: {
            chat: {
                messages: [],
                confusionScore,
            },
        },
    });
};

describe("ConfusionMeter Component", () => {
    it("should render confusion meter with score", () => {
        const store = createMockStore(50);
        render(
            <Provider store={store}>
                <ConfusionMeter />
            </Provider>
        );

        expect(screen.getByText("AI Confusion Level")).toBeInTheDocument();
        expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("should show 'Clear Understanding' for low scores", () => {
        const store = createMockStore(20);
        render(
            <Provider store={store}>
                <ConfusionMeter />
            </Provider>
        );

        expect(screen.getByText("Clear Understanding")).toBeInTheDocument();
    });

    it("should show 'Some Confusion' for medium scores", () => {
        const store = createMockStore(45);
        render(
            <Provider store={store}>
                <ConfusionMeter />
            </Provider>
        );

        expect(screen.getByText("Some Confusion")).toBeInTheDocument();
    });

    it("should show 'Very Confused' for high scores", () => {
        const store = createMockStore(75);
        render(
            <Provider store={store}>
                <ConfusionMeter />
            </Provider>
        );

        expect(screen.getByText("Very Confused")).toBeInTheDocument();
    });

    it("should cap score at 100%", () => {
        const store = createMockStore(150);
        render(
            <Provider store={store}>
                <ConfusionMeter />
            </Provider>
        );

        expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("should not show negative scores", () => {
        const store = createMockStore(-10);
        render(
            <Provider store={store}>
                <ConfusionMeter />
            </Provider>
        );

        expect(screen.getByText("0%")).toBeInTheDocument();
    });
});
