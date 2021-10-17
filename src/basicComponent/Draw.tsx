import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";

import "./Draw.less";

interface Props {
    visible: boolean
    width: string
    onClose: () => void
}

const Draw: React.FC<Props> = (props) => {
    const {children, visible, width, onClose} = props

    const [basicStyle, setBasicStyle] = useState({})
    const [innerVisible, setInnerVisible] = useState(false)
    const [bgOpacity, setBgOpacity] = useState(1)

    useEffect(() => {
        const bodyDomStyle = window.document.body.style
        const rootDom = window.document.getElementById("root")
        if (visible) {
            if (rootDom.clientWidth < window.innerWidth) {
                rootDom.style.marginRight = "17px"
            }
            bodyDomStyle.overflowY = "hidden"
            setInnerVisible(true)
            setBasicStyle({left: `calc(100vw - ${width})`})
            localStorage.setItem("drawIsWheel", "false")
            setBgOpacity(1)
        } else {
            setTimeout(() => {
                if (rootDom.clientWidth < window.innerWidth) {
                    rootDom.style.marginRight = "0"
                }
                bodyDomStyle.overflowY = "auto"
                setInnerVisible(false)
                onClose()
            }, 500)
            setBasicStyle({left: "100vw"})
            localStorage.setItem("drawIsWheel", "true")
            setBgOpacity(0)
        }
    }, [visible])

    return ReactDOM.createPortal(
        innerVisible && <div className="draw-container-pad">
            <div
                onClick={() => {
                    onClose()
                }}
                className="out-of-draw-basic-pad-container"
                style={{opacity: bgOpacity}}
            />
            <div style={{...basicStyle, width}}
                 className="draw-basic-pad">
                {children}
            </div>
        </div>, document.body
    )
};

export default Draw;