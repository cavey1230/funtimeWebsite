import React, {ReactElement, useImperativeHandle, useState} from 'react';

import "./Step.less";

interface Props {
    stepLabelArray: Array<{
        name: string
        id: number
        index: number
        status: number
    }>
    initializeSelectId: number
    labelItemSize: {
        width: string
        height: string
    }
    contentStyle?: { [key: string]: string | number }
}

const Step: React.FC<Props & React.RefAttributes<any>> = React.forwardRef((props, ref) => {
    const {stepLabelArray, initializeSelectId, children, contentStyle, labelItemSize} = props

    const [selectedId, setSelectedId] = useState(initializeSelectId)

    useImperativeHandle(ref, () => (
        {
            addSelectId: () => {
                selectedId < stepLabelArray.length - 1 && setSelectedId(selectedId + 1)
            },
            minusSelectId: () => {
                selectedId > 0 && setSelectedId(selectedId - 1)
            }
        }
    ))

    const renderLabelArray = (stepLabelArray: Props["stepLabelArray"]) => {
        return stepLabelArray && stepLabelArray.map((item) => {
            const {id, name, index: itemIndex, status} = item
            return <div
                className="step-label-item-container"
                key={id}
                // onClick={()=>{
                //     setSelectedId(id)
                // }}
            >
                <div
                    className={`step-label-item ${selectedId === id ? "selected" : ""}`}
                    style={labelItemSize}
                >
                    <div>
                        {itemIndex}
                    </div>
                    {status === 0 || selectedId === id ? <div>
                        {name}
                    </div> : <div className="finish">
                        <div/>
                        <div/>
                    </div>}
                </div>
            </div>
        })
    }

    const renderChildren = () => {
        return React.Children.map(children, (child: ReactElement) => {
            const childId = Number(child.props.id)
            const childStyle = child.props.style
            return React.cloneElement(child, {
                style: childId === selectedId ?
                    {display: "unset", ...childStyle} :
                    {display: "none", ...childStyle}
            })
        })
    }

    return (
        <div className="step-out-container">
            <div className="step-label-group">
                {renderLabelArray(stepLabelArray)}
            </div>
            <div style={contentStyle} className="step-content-container">
                {renderChildren()}
            </div>
        </div>
    );
})

export default Step;