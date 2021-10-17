import React, {useEffect, useRef, useState} from 'react';
import classnames from "@/utils/classnames";
import {tuple} from '@/utils/typescriptUtils';

import "./Dropdown.less";

const positionName = tuple(
    'topLeft',
    'topCenter',
    'topRight',
    'bottomLeft',
    'bottomCenter',
    'bottomRight',
);

export interface Props {
    label: string | JSX.Element
    model?: "hover" | "click"
    position: typeof positionName[number]
    style?: { [key: string]: string | number }
    expandStatus: boolean
    setExpandStatus: (bool: boolean) => void
    onClick?: () => void
    onOutClick?: () => void
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    timeDelay?: number
}

interface Boundary {
    [key: string]: number
}

let DropdownPublicTimeOutId: NodeJS.Timer

const Dropdown: React.FC<Props> = (props) => {

    const {
        label,
        children,
        model,
        position,
        style,
        setExpandStatus,
        expandStatus,
        onClick,
        onOutClick,
        onMouseEnter,
        onMouseLeave,
        timeDelay
    } = props

    const innerModel = model ? model : "hover"

    const [dropdownHeight, setDropdownHeight] = useState(0)

    const dropdownContainerRef = useRef(null)

    const expandContainerRef = useRef(null)

    const labelContainerRef = useRef(null)

    const handleClick = (event: MouseEvent) => {
        if (dropdownContainerRef.current.contains(event.target)) return
        onOutClick ? onOutClick() : setExpandStatus(false)
    }

    useEffect(() => {
        innerModel === "click" && document.addEventListener("click", handleClick)
        return () => {
            innerModel === "click" && document.removeEventListener("click", handleClick)
        }
    }, [])

    useEffect(() => {
        const selectBoundary = (mainBorder: Boundary, supportBorder: Boundary, mouseTop: number, mouseLeft: number) => {
            const difference = mainBorder.top
            const close = () => {
                setExpandStatus(false)
                onMouseLeave && onMouseLeave()
            }
            if (mouseTop < difference && mouseTop > supportBorder.top) {
                if (mouseLeft < supportBorder.left || mouseLeft > supportBorder.right) close()
            } else if (mouseTop < supportBorder.top) close()
            if (mouseTop > difference && mouseTop < mainBorder.bottom) {
                if (mouseLeft < mainBorder.left || mouseLeft > mainBorder.right) close()
            } else if (mouseTop > mainBorder.bottom) close()
        }
        const mouseMoveFunc = (event: MouseEvent) => {
            if (!expandStatus) return
            if (labelContainerRef.current && expandContainerRef.current) {
                if (position === "topLeft" || position === "topRight" || position === "topCenter") {
                    selectBoundary(labelContainerRef.current.getBoundingClientRect(),
                        expandContainerRef.current.getBoundingClientRect(),
                        event.clientY, event.clientX)
                } else {
                    selectBoundary(expandContainerRef.current.getBoundingClientRect(),
                        labelContainerRef.current.getBoundingClientRect(),
                        event.clientY, event.clientX)
                }
            }
        }
        if (expandStatus) {
            setTimeout(() => {
                expandContainerRef.current && setDropdownHeight(expandContainerRef.current.offsetHeight)
            }, 100)
        } else {
            clearTimeout(DropdownPublicTimeOutId)
            setDropdownHeight(0)
        }
        innerModel === "hover" && document.addEventListener("mousemove", mouseMoveFunc)
        return () => {
            innerModel === "hover" && document.removeEventListener("mousemove", mouseMoveFunc)
        }
    }, [expandStatus])

    return (
        <div
            style={style}
            ref={dropdownContainerRef}
            className={classnames(
                "dropdown-container",
                `${position}`
            )}
            onClick={() => {
                clearTimeout(DropdownPublicTimeOutId)
                if (innerModel === "click") {
                    onClick ? onClick() : setExpandStatus(true)
                }
            }}
            onMouseEnter={() => {
                if (innerModel === "hover") {
                    onMouseEnter && onMouseEnter()
                    clearTimeout(DropdownPublicTimeOutId)
                    DropdownPublicTimeOutId = setTimeout(() => {
                        setExpandStatus(true)
                    }, timeDelay ? timeDelay : 500)
                }
            }}
            onMouseLeave={() => {
                clearTimeout(DropdownPublicTimeOutId)
            }}
        >
            <div ref={labelContainerRef} className="dropdown-label">
                {label}
            </div>
            {expandStatus && <div
                className="dropdown-expand-container"
                style={{height: dropdownHeight}}
            >
                <div
                    ref={expandContainerRef}
                    className="fillDiv"
                >
                    {children}
                </div>
            </div>}
        </div>
    );
}

export default Dropdown;