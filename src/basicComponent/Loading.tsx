import React from "react";
import ReactDom from "react-dom";

import "./Loading.less";

interface Props {
    visible: boolean
}

const Loading: React.FC<Props> = (props) => {

    const {visible} = props

    return ReactDom.createPortal(
        visible && <div
            className="loading-pad"
        >
            <div className="loading-container-pad">
                <span className="loading-container-pad-item"/>
                <span className="loading-container-pad-item "/>
                <span className="loading-container-pad-item "/>
                <span className="loading-container-pad-item "/>
                <span className="loading-container-pad-item "/>
                <span className="loading-container-pad-item"/>
                <span className="loading-container-pad-item"/>
            </div>
        </div>, document.body)
};

export default Loading;