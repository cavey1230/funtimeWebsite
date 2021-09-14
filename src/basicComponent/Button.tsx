import React, {useCallback} from 'react';

import './Button.less';

interface Props {
    type: "primary" | "warn" | "dangerous" | "disable" | "submit"
    style: object
    onClick: () => void
}

const Button: React.FC<Partial<Props>> = (props) => {

    const {type, children, onClick, style} = props

    const getButtonTypeStyle = useCallback((type: string) => {
        if (type === "primary" || type === "submit" || !type) {
            return "button-primary-style"
        } else if (type === "warn") {
            return " button-warn-style"
        } else if (type === "dangerous") {
            return " button-dangerous-style"
        } else if (type === "disable") {
            return " button-disable-style"
        }
    }, [])

    return (
        <button
            style={style}
            className={`button-basic-style ${getButtonTypeStyle(type)}`}
            onClick={(event) => {
                event.preventDefault()
                onClick && onClick()
            }}
            disabled={type === "disable"}
        >
            {children}
        </button>
    );
};

export default Button;