import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';

import {ExpandIcon, NoExpandIcon} from "@/assets/icon/iconComponent"

interface Props {
    options: Array<any>
    onChange?: (value: any) => void
    returnValueKey: string
    labelKey: string
    placeholder?: string
    initializeValue?: number | string
    rely?: any
    relyToastMessage?: string
    returnString?: boolean
}

import "./Selector.less";
import {showToast} from "@/utils/lightToast";

const Selector: React.FC<Props & React.RefAttributes<any>> = forwardRef((
    props, ref
) => {
    const {
        options, onChange, returnValueKey,
        placeholder, labelKey, initializeValue,
        rely, relyToastMessage, returnString
    } = props

    //取得的labelKey值
    const [selectedValue, setSelectedValue] = useState(placeholder)

    const [expandVisible, setExpandVisible] = useState(false)

    const selectorRef = useRef(null)

    const handleClick = (event: MouseEvent) => {
        if (selectorRef.current.contains(event.target)) return
        setExpandVisible(false)
    }

    useImperativeHandle(ref, () => {
        return {
            init: () => {
                setSelectedValue(placeholder)
            }
        }
    })

    useEffect(() => {
        if (initializeValue) {
            const result = options.find((item) => item[returnValueKey] === initializeValue)
            const value = result && result[returnValueKey]
            result && setSelectedValue(result[labelKey])
            onChange && onChange(returnString ? String(value) : value)
        }
    }, [initializeValue, options])

    useEffect(() => {
        document.addEventListener("click", handleClick)
        return () => {
            document.removeEventListener("click", handleClick)
        }
    }, [])

    const getTypeOfValueKey = useMemo(() => {
        return options.length > 0 ? typeof options[0][returnValueKey] : null
    }, [options])

    const renderSelectorOptions = useCallback((arr: Array<any>) => {
        return arr?.map((item, index) => {
            const value = item[returnValueKey]
            const label = item[labelKey]
            return <li
                key={index}
                onClick={(event) => {
                    event.nativeEvent.stopPropagation()
                    event.preventDefault()
                    setSelectedValue(label)
                    setExpandVisible(false)
                    const result = getTypeOfValueKey === "string" ?
                        String(value) : getTypeOfValueKey === "number" ?
                            Number(value) : value
                    onChange && onChange(returnString ? String(result) : result)
                }}
            >
                {item[labelKey]}
            </li>
        })
    }, [])

    return (
        <div className="selector-container" ref={selectorRef}>
            <div className="selector-label" onClick={() => {
                if (!rely && relyToastMessage) {
                    showToast(relyToastMessage, "warn")
                    return
                }
                setExpandVisible(prevState => !prevState)
            }}>
                <span>{selectedValue}</span>
                <span>{expandVisible ? <ExpandIcon/> : <NoExpandIcon/>}</span>
            </div>
            {expandVisible && <div className="selector-expand-list publicFadeIn-500ms">
                <ul>
                    {renderSelectorOptions(options)}
                </ul>
            </div>}
        </div>
    );
})

export default Selector;