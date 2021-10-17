import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';

import './Input.less';
import {showToast} from "@/utils/lightToast";
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";

interface Props {
    placeholder: string
    width?: number | string
    height?: number | string
    initializeValue?: string | number
    onChange?: (result: string | number) => void
    onFocus?: () => void
    onKeyDown?: (event: React.KeyboardEvent) => void
    type?: string
    autocomplete?: string
    style?: Object
    noFocusStyle?: boolean
    textAreaMode?: boolean
    onBlur?: () => void
    ref?: React.Ref<any>
    matchAll?: boolean
    regexp?: RegExp
}

const Input: React.FC<Props & React.RefAttributes<any>> = forwardRef((
    props, ref
    ) => {

        const {
            placeholder, width, height, onKeyDown, matchAll,
            initializeValue, onChange, onFocus, onBlur,
            type, autocomplete, style, noFocusStyle, textAreaMode
        } = props

        const [value, setValue] = useState(initializeValue || "")

        const matchAllChar = new RegExp(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·！￥…（）—《》？：“”【】、；‘，。]/im)

        const matchSpecialChar = new RegExp(/[`~#$%^&*<>{}|\/;'\\[\]￥…“”【】、；‘']/im)

        const inputRef = useRef(null)

        const isMobile = useSelector((store: ReduxRootType) => {
            return store.windowResizeReducer.isMobile
        })

        let isOnComposition = false

        useImperativeHandle(ref, () => ({
            setValue, value
        }));

        useEffect(() => {
            if (initializeValue) {
                const result = matchSymbol(initializeValue as string)
                result && setValue(initializeValue)
            } else {
                setValue("")
            }
        }, [initializeValue])

        useEffect(() => {
            let timeOutId: NodeJS.Timer
            timeOutId = setTimeout(() => {
                inputRef.current.value = value
                onChange && onChange(value)
            }, 100)
            return () => {
                clearTimeout(timeOutId)
            }
        }, [value])


        const handleComposition = (evt: React.CompositionEvent) => {
            if (evt.type === 'compositionend') {
                isOnComposition = false
                if ((navigator.userAgent.indexOf('Chrome') > -1) || isMobile) {
                    handleChange(evt);
                }
                return;
            }
            isOnComposition = true
        };

        const matchSymbol = (value: string) => {
            const reg = matchAll ? matchAllChar : matchSpecialChar
            if (value.length > 0) {
                if (reg.test(value)) {
                    showToast("不能包含特殊字符", "error")
                    return false
                } else {
                    return true
                }
            }
            return true
        }

        const handleChange = (event: any) => {
            if (!isOnComposition) {
                const targetValue = event.target.value
                const result = matchSymbol(targetValue)
                console.log("我是处理结果", result)
                if (result) {
                    setValue(targetValue)
                } else {
                    event.target.value = value
                }
            }
        }

        const innerType = type ? type : "text"

        const composition = {
            onCompositionStart: handleComposition,
            onCompositionUpdate: handleComposition,
            onCompositionEnd: handleComposition
        }

        return (
            <div style={{
                width, height, display: "flex", justifyContent: "center"
            }}>
                {textAreaMode ? <textarea
                    style={style}
                    autoComplete={autocomplete}
                    className={"textareaStyle"}
                    onChange={(event) => {
                        handleChange(event)
                    }}
                    onFocus={() => onFocus ? onFocus() : null}
                    onBlur={() => onBlur ? onBlur() : null}
                    placeholder={placeholder}
                    {...composition}
                    ref={inputRef}
                /> : <input
                    onKeyDown={(event) => {
                        onKeyDown && onKeyDown(event)
                    }}
                    style={style}
                    autoComplete={autocomplete}
                    className={noFocusStyle ? "inputStyleNoFocus" : "inputStyle"}
                    onChange={(event) => {
                        handleChange(event)
                    }}
                    {...composition}
                    onFocus={() => onFocus ? onFocus() : null}
                    onBlur={() => onBlur ? onBlur() : null}
                    type={innerType}
                    placeholder={placeholder}
                    ref={inputRef}
                />}
            </div>
        )
    }
)

export default Input;