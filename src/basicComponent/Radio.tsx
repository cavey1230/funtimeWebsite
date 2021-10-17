import React, {CSSProperties, forwardRef, useEffect, useImperativeHandle, useState} from 'react';

import "./Radio.less";

interface Props {
    size: "small" | "middle" | "larger"
    alignItems: string
    width: string
    display?:CSSProperties["display"]
    onChange?: (bool: boolean | string) => void
}

const Radio: React.FC<Props & React.RefAttributes<any>> = forwardRef((
    props, ref
) => {

    const {
        alignItems, width, size,
        onChange, children,display
    } = props

    const [selected, setSelected] = useState(false)

    useImperativeHandle(ref, () => ({
        value: selected ? "true" : "",
        setValue: () => {
            setSelected(false)
        }
    }))

    useEffect(() => {
        onChange && onChange(selected ? "true" : "")
    }, [selected])

    const radioSize = (size: Props["size"]) => {
        switch (size) {
            case "small":
                return {
                    width: "1rem",
                    height: "1rem"
                }
            case "middle":
                return {
                    width: "2rem",
                    height: "2rem"
                }
            case "larger":
                return {
                    width: "3rem",
                    height: "3rem"
                }
        }
    }

    return (
        <div
            className="radio-item-container"
            style={{alignItems, width,display}}
            onClick={() => {
                setSelected(prevState => !prevState)
            }}
        >
            <div className="radio-background" style={radioSize(size)}>
                {selected && <div className="radio-slider"/>}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
})

export default Radio;