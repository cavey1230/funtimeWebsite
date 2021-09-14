import React, {useEffect, useRef, useState} from 'react';

import "./Badeg.less";

interface Props {
    targetNum: number
    backgroundColor?: string
    fontSize?: string
    badegSize?: "small" | "middle" | "large"
    left?: string
    top?: string
    fullwidth?: boolean
}

const Badeg: React.FC<Props> = (props) => {

    const {children, targetNum, backgroundColor, fontSize, badegSize, left, top, fullwidth} = props

    const innerFontSize = fontSize ? fontSize : "1.2rem"

    const innerSize = badegSize ? badegSize : "middle"

    const innerLeft = left ? left : "70%"

    const innerTop = top ? top : "-20%"

    const innerBackgroundColor = backgroundColor ? backgroundColor : "red"

    const [containerWidth, setContainerWidth] = useState(0)

    const childrenRef = useRef(null)

    useEffect(() => {
        setTimeout(() => {
            childrenRef.current && setContainerWidth(childrenRef.current.clientWidth)
        }, 0)
    })

    const initializeNumAndUnit = (fontSize: string) => {
        const numberRegExp = /\d+(\.*)\d*/
        const unitRegExp = /px|rem|em|%/
        const num = Number(fontSize.match(numberRegExp)[0])
        const unit = fontSize.match(unitRegExp)[0]
        return {num, unit}
    }

    const getPadding = (size: string) => {
        switch (size) {
            case "small":
                return 0
            case "middle":
                return 0.2
            case "large":
                return 0.4
            default :
                return 0.2
        }
    }

    const getBadegItemStyle = (targetNum: number) => {
        let initializeWidth = innerFontSize
        const {num, unit} = initializeNumAndUnit(initializeWidth)
        if (targetNum >= 10 && 99 >= targetNum) {
            initializeWidth = (num * 2) + unit
        } else if (targetNum >= 100) {
            initializeWidth = (num * 3) + unit
        }
        return {
            width: initializeWidth,
            minWidth: num + getPadding(innerSize) + unit,
            fontSize: innerFontSize,
            borderRadius: innerFontSize,
            padding: getPadding(innerSize) + unit
        }
    }

    return (
        <div className="badeg-container"
             style={{width: fullwidth ? "100%" : containerWidth}}
        >
            {targetNum > 0 && <div className="badeg-item" style={{
                backgroundColor: innerBackgroundColor,
                ...getBadegItemStyle(targetNum),
                left: innerLeft,
                top: innerTop
            }}>
                {targetNum > 999 ? 999 : targetNum}
            </div>}
            <div className="children-container"
                 ref={childrenRef}
                 style={{width: fullwidth ? "100%" : null}}
            >
                {children}
            </div>
        </div>
    );
};

export default Badeg;