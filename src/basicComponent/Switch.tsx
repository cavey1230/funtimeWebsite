import React from 'react';

import "./Switch.less";

interface Props {
    status: boolean
    setStatus: () => void
    labelArray: [string, string]
}

const Switch: React.FC<Props> = (props) => {
    const {status, setStatus, labelArray} = props

    return (
        <div
            className="switch-button-container"
            onClick={() => {
                setStatus()
            }}
        >
            <div className="switch-label">
                <span>{labelArray[0]}</span>
                <span>{labelArray[1]}</span>
            </div>
            <div
                style={{left: !status ? 0 : "calc(100% - 3rem)"}}
                className="switch-slider"
            />
        </div>
    );
};

export default Switch;