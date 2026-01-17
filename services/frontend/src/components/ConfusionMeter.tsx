import React from "react";
import { useAppSelector } from "../store/hooks";

export const ConfusionMeter: React.FC = () => {
    const score = useAppSelector((state) => state.chat.confusionScore);
    const percentage = Math.min(100, Math.max(0, score));

    const getScoreColor = (score: number) => {
        if (score < 45) return "var(--success)";
        if (score < 75) return "var(--warning)";
        return "var(--error)";
    };

    const getScoreLabel = (score: number) => {
        if (score < 45) return "Clear Understanding";
        if (score < 75) return "Minor Confusion";
        return "Significant Confusion";
    };

    return (
        <div className="panel-card">
            <h3 className="panel-title">AI Confusion Level</h3>
            <div className="confusion-score-display" style={{ color: getScoreColor(percentage) }}>
                {percentage}%
            </div>
            <div className="meter-container">
                <div
                    className="meter-fill"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: getScoreColor(percentage)
                    }}
                />
            </div>
            <div className="meter-label">
                {getScoreLabel(percentage)}
            </div>
        </div>
    );
};
