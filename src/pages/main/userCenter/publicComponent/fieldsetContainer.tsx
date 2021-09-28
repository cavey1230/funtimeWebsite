import React from 'react';

import "./fieldsetConatiner.less";

interface Props {
    title: string
    borderWidth?: string
}

const FieldsetContainer: React.FC<Props> = (props) => {
    const {title, children, borderWidth} = props

    return (
        <fieldset
            style={{borderWidth}}
            className="user-center-fieldset-container"
        >
            <legend>{title}</legend>
            <div className="user-center-fieldset-content">
                {children}
            </div>
        </fieldset>
    );
};

export default FieldsetContainer;