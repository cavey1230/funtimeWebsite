import React, {ChangeEvent, forwardRef, useCallback, useEffect, useImperativeHandle, useState} from 'react';

import './Input.less';
import {matchSpecialSymbol} from "@/utils/stringMatchingTool";
import {showToast} from "@/utils/lightToast";

interface Props {
    placeholder: string
    width?: number | string
    height?: number | string
    initializeValue?: string | number
    onChange?: (result: string | number) => void
    onFocus?: () => void
    type?: string
    autocomplete?: string
    style?: Object
    noFocusStyle?: boolean
    textAreaMode?: boolean
    onBlur?: () => void
    ref?: React.Ref<any>
}

const Input: React.FC<Props> = forwardRef((props, ref) => {

    const {
        placeholder, width, height,
        initializeValue, onChange, onFocus, onBlur,
        type, autocomplete, style, noFocusStyle, textAreaMode
    } = props

    const [value, setValue] = useState(initializeValue || "")

    useImperativeHandle(ref, () => ({
        setValue, value
    }));

    useEffect(() => {
        let timeOutId: NodeJS.Timer
        timeOutId = setTimeout(() => {
            onChange(value)
        }, 100)
        return () => {
            clearTimeout(timeOutId)
        }
    }, [value])

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value
        if (matchSpecialSymbol(value) > 0) {
            showToast("不能包含特殊字符", "error")
            return
        }
        setValue(value)
    }, [])

    const innerType = type ? type : "text"

    return (
        <div style={{
            width, height, display: "flex", justifyContent: "center"
        }}>
            {textAreaMode ? <textarea
                style={style}
                autoComplete={autocomplete}
                className={"textareaStyle"}
                value={value}
                onChange={(event) => handleChange(event)}
                onFocus={() => onFocus ? onFocus() : null}
                onBlur={() => onBlur ? onBlur() : null}
                placeholder={placeholder}
            /> : <input
                style={style}
                autoComplete={autocomplete}
                className={noFocusStyle ? "inputStyleNoFocus" : "inputStyle"}
                value={value}
                onChange={(event) => handleChange(event)}
                onFocus={() => onFocus ? onFocus() : null}
                onBlur={() => onBlur ? onBlur() : null}
                type={innerType}
                placeholder={placeholder}
            />}
        </div>
    );
})

export default Input;