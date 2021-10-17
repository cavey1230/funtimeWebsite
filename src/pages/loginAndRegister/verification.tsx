import React, {useEffect, useRef, useState} from "react";

import "./verification.less";
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";

type Props = {
    width: string
    height: string
    successCallBack: (status: boolean) => void
    status: boolean
}

const Verification: React.FC<Props> = (props) => {
    const {width, height, successCallBack, status} = props
    const [success, setSuccess] = useState(false)
    const containerRef = useRef(null)
    const btnRef = useRef(null)

    const outContainerStyle = {width, height}
    const grayBackgroundColor = {backgroundColor: "#d7d7d7"}
    const blackBackgroundColor = {backgroundColor: "#d7d7d7"}
    const normalTextStyle = {lineHeight: height, color: "black"}

    const isMobile = useSelector((store: ReduxRootType) => {
        return store.windowResizeReducer.isMobile
    })

    useEffect(() => {
        if (!status) {
            setSuccess(false)
            btnRef.current && (btnRef.current.style.left = 0)
        }
    }, [status])

    const replacePx = (str: string) => {
        return Number(str.replace("px", ""))
    }

    const onMouseDown = (event: React.MouseEvent) => {
        const outContainerWidth = containerRef.current.offsetWidth
        const btnWidth = btnRef.current.offsetWidth
        const distance = outContainerWidth - btnWidth
        const initMouseClientX = event.clientX
        document.onmouseup = () => onMouseUp()

        if (!success) {
            document.onmousemove = (ev) => {
                let offsetWidth = ev.clientX - initMouseClientX
                if (offsetWidth < 0) {
                    offsetWidth = 0
                }
                if (offsetWidth >= distance) {
                    offsetWidth = distance
                }
                btnRef.current.style.left = `${offsetWidth}px`
                if (replacePx(btnRef.current.style.left) === distance) {
                    // console.log("我已经到底了")
                    document.onmousemove = null
                    setSuccess(true)
                    successCallBack(true)
                }
            }
        }
    }

    const onMouseUp = () => {
        const outContainerWidth = containerRef.current.offsetWidth
        const btnWidth = btnRef.current.offsetWidth
        const distance = outContainerWidth - btnWidth
        if (replacePx(btnRef.current.style.left) < distance)
            btnRef.current.style.left = 0
        document.onmouseup = null
        document.onmousemove = null
    }

    return (
        <React.Fragment>
            {isMobile ? <div className="verification-button-model">
                <div
                    className="verification-text"
                    style={normalTextStyle}
                    onClick={() => {
                        setSuccess(true)
                        successCallBack(true)
                    }}
                >
                    {success ? "验证成功" : "点击以验证"}
                </div>
            </div> : <div
                ref={containerRef}
                className="verification-out-container"
                style={outContainerStyle}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseUp}
                onMouseUp={onMouseUp}
            >
                <div
                    className="verification-bg"
                    style={success ? blackBackgroundColor : grayBackgroundColor}
                />
                <div
                    className="verification-text"
                    style={normalTextStyle}
                >
                    {success ? "验证成功" : "滑动以验证"}
                </div>
                <div
                    style={{height}}
                    ref={btnRef}
                    className="verification-btn"
                >
                    {/*<img*/}
                    {/*    src={""}*/}
                    {/*    draggable={false}*/}
                    {/*    alt="rightArrow"*/}
                    {/*/>*/}
                </div>
            </div>}
        </React.Fragment>
    );
};

export default Verification;