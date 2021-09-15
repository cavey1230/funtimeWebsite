import React from 'react';

import "./withLabel.less";

interface Props {
    label: string
    model?: "row" | "column" | "column-reverse"
}

const WithLabel: React.FC<Props> = (props) => {
    const {label, children, model} = props

    return (
        <div
            className="with-label-container"
            style={{
                flexDirection: model ? model : "row"
            }}
        >
            <div>
                {label}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
};

export default WithLabel;