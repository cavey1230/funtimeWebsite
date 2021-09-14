import React from "react";
import ReactDom from "react-dom";
import Button from "./Button";

import "./Confirm.less";

interface Props {
    title: string
    content: string
    onClick: () => void
    onCancel: () => void
    onClickText: string
    onCancelText: string
    destroy: () => void
}

type confirm = (params: Partial<Props>) => void

export const Confirm: React.FC<Partial<Props>> = (props) => {

    const {
        title, content, onCancel,
        onClick, onClickText,
        onCancelText, destroy
    } = props

    return (
        <div className="confirm-pad">
            <div className="title">
                {title}
            </div>
            <div className="content">
                {content}
            </div>
            <div className="action">
                <Button
                    style={{
                        backgroundColor: "white",
                        color: "black"
                    }}
                    onClick={() => {
                        onCancel && onCancel()
                        destroy()
                    }}>
                    {onCancelText ? onCancelText : "取消"}
                </Button>
                <div className="fill-border">

                </div>
                <Button
                    style={{
                        backgroundColor: "white",
                        color: "black"
                    }}
                    onClick={() => {
                        onClick && onClick()
                        destroy()
                    }}>
                    {onClickText ? onClickText : "确认"}
                </Button>
            </div>
        </div>
    );
};


export const confirm: confirm = function (props) {
    const {title, content, onCancel, onClick, onClickText, onCancelText} = props
    const div = document.createElement("div")
    div.className = "confirm-out-container"
    document.body.appendChild(div)
    ReactDom.render(<Confirm
        title={title}
        content={content}
        onCancel={onCancel}
        onClick={onClick}
        onCancelText={onCancelText}
        onClickText={onClickText}
        destroy={() => {
            destroy(div)
        }}
    />, div)
}

function destroy(oldChildren: Node) {
    document.body.removeChild(oldChildren)
}