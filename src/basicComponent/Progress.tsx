import React from 'react';

import "./Progress.less";

interface Props {
    nowExperience: number
    nextExperience: number
    height?: string
    width?: string
    model?: "row" | "column"
    label: string
}

const Progress: React.FC<Props> = (props) => {

    const {nowExperience, nextExperience, height, width, model, label} = props

    const copyModel = model ? model : "column"

    const getPercent = (num1: number, num2: number): string => {
        const percent = (num1 / num2 * 100).toFixed(2)
        return percent + "%"
    }

    return (
        <div className="progress-out-container" style={{flexDirection: copyModel}}>
            <div className="progress-container" style={{height, width}}>
                <div className="progress-percent" style={{width: getPercent(nowExperience, nextExperience)}}/>
            </div>
            <div className="progress-label-container" style={copyModel === "row" ? {
                marginLeft: "0.5rem"
            } : {
                marginTop: "0.5rem"
            }}>
                <span>{label}</span>
                <span>{`${nowExperience}/${nextExperience}`}</span>
            </div>
        </div>

    );
};

export default Progress;