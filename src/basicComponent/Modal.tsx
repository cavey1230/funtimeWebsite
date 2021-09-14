import React, {useCallback, useEffect, useRef, useState} from "react";
import { CloseIcon } from "@/assets/icon/iconComponent";
import ReactDom from "react-dom";

import "./Modal.less";

interface Props {
    width: string
    height: string
    onClose: () => void
    visible: boolean
    disableDoubleClick?: boolean
    style: { [key: string]: string | number }
}

const Modal: React.FC<Partial<Props>> = (Props) => {

    const {width, height, onClose, children, visible, disableDoubleClick,style} = Props

    const [isMouseDown, setIsMouseDown] = useState(false)
    const [mousePositionObj, setMousePositionObj] = useState({
        prevClientX: 0,
        prevClientY: 0
    })
    const [topPadPosition, setTopPadPosition] = useState({
        left: 0,
        top: 0
    })
    const topContainerRef = useRef(null)

    useEffect(() => {
        const bodyDomStyle = document.body.style
        const rootDom = document.getElementById("root")
        const rightNavbar = document.getElementById("navbar")
        if (visible) {
            if (rootDom.clientWidth < window.innerWidth) {
                rootDom.style.marginRight = "17px"
                // rightNavbar.style.width = "calc(100% - 17px)"
            }
            localStorage.setItem("modalIsWheel", "false")
            bodyDomStyle.overflowY = "hidden"
        } else {
            if (rootDom.clientWidth < window.innerWidth) {
                rootDom.style.marginRight = "0"
                // rightNavbar.style.width = "100%"
            }
            localStorage.setItem("modalIsWheel", "true")
            bodyDomStyle.overflowY = "auto"
        }
    }, [visible])

    useEffect(() => {
        const keydownFuc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose && onClose()
            }
        }
        window.addEventListener("keydown", keydownFuc)
        return () => {
            window.removeEventListener("keydown", keydownFuc)
        }
    }, [])

    const initializeFunc = useCallback(() => {
        const innerStyleObj: { [key: string]: string } = {}
        width ? innerStyleObj["width"] = width : innerStyleObj["width"] = "50vw"
        height ? innerStyleObj["height"] = height : innerStyleObj["height"] = "50vh"
        return innerStyleObj
    }, [])

    const getMousePositionXAndY = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const offsetX = event.clientX - mousePositionObj.prevClientX
        const offsetY = event.clientY - mousePositionObj.prevClientY
        // if (Math.abs(offsetX) > 5 || Math.abs(offsetY) > 5) {
        setTopPadPosition({
            left: topPadPosition.left + offsetX,
            top: topPadPosition.top + offsetY
        })
        setMousePositionObj({
            prevClientX: event.clientX,
            prevClientY: event.clientY
        })
        // }
    }

    const removeMoveEvent = useCallback(() => {
        // console.log("我被清除了")
        setIsMouseDown(false)
    }, [])

    return ReactDom.createPortal(
        visible && <div className="modal-out-container-pad">
            <div
                className="modal-bottom-container-pad"
                onClick={() => {
                    onClose && onClose()
                }}
            />
            <div
                className="modal-top-container-pad"
                style={{
                    ...initializeFunc(),
                    ...style,
                    left: topPadPosition.left,
                    top: topPadPosition.top
                }}
                ref={topContainerRef}
                draggable="false"

                onMouseMove={(event) => {
                    if (isMouseDown) {
                        getMousePositionXAndY(event)
                    }
                }}

                onDoubleClick={() => {
                    if (!disableDoubleClick) {
                        const {offsetHeight, offsetTop, offsetWidth, offsetLeft} = topContainerRef.current
                        mousePositionObj.prevClientX = offsetLeft + Math.ceil(offsetWidth / 2)
                        mousePositionObj.prevClientY = offsetTop + Math.ceil(offsetHeight / 2)
                        setIsMouseDown(true)
                    }
                }}

                onMouseUp={() => {
                    removeMoveEvent()
                }}
            >
                <div className="modal-top-inner-container-pad">
                    <div className="modal-top-inner-container-pad-close-icon">
                        <div
                            className="icon-container-pad"
                            onClick={(event) => {
                                event.preventDefault()
                                onClose && onClose()
                            }}
                        >
                            <CloseIcon/>
                        </div>
                    </div>
                    <div className="children-container-pad">
                        {children}
                    </div>
                </div>
            </div>
        </div>, document.body)
};

export default Modal;