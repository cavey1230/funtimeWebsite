import React, {useState} from 'react';

import "./Radio.less";

interface Props {
    size: "small" | "middle" | "larger"
    alignItems: string
    width: string
    onChange: (bool: boolean) => void
}


const Radio: React.FC<Props> = (props) => {

    const {alignItems, width, size, onChange, children} = props

    const [selected, setSelected] = useState(false)

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
            style={{alignItems, width}}
            onClick={() => {
                setSelected(prevState => !prevState)
                onChange(!selected)
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
};

export default Radio;