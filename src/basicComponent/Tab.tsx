import React, {ReactElement, useEffect, useState} from "react";

import "./Tab.less";

export interface TabProps {
    labelArr: Array<{
        title: string
        id: number
        icon?: string | JSX.Element
    }>
    onChange: (selectedId: number) => void
    height: string
    initializeSelectId?: string | number
    blockDisplay?: boolean
    allowScroll?: boolean
}

type renderLabel = (labelArr: TabProps["labelArr"]) => ReactElement[]

export const Tab: React.FC<Partial<TabProps>> = (props) => {

    const {labelArr, children, onChange, height, initializeSelectId, blockDisplay, allowScroll} = props

    const [selectedId, setSelectedId] = useState(() => {
        return initializeSelectId ? Number(initializeSelectId) : 0
    })

    useEffect(() => {
        onChange(selectedId)
    }, [selectedId])

    const renderLabel: renderLabel = (labelArr) => {
        return labelArr?.map((item, index) => {
            const {id, title, icon} = item
            return <div
                className={`tab-label-pad-item ${(selectedId === id ? "tab-selected" : "")}`}
                key={id}
                onClick={() => {
                    setSelectedId(id)
                }}
            >
                {icon && (typeof icon === "string" ?
                    <img src={icon} alt="icon"/> : React.cloneElement(icon as JSX.Element))}
                {title}
            </div>
        })
    }

    const renderContainer = (children: React.ReactNode) => {
        return React.Children.map(children, (child, index) => {
            const childSelfStyle = (child as ReactElement).props.style
            const childSelfId = (child as ReactElement).props.id
            return React.cloneElement(child as ReactElement, {
                style: selectedId === Number(childSelfId) ?
                    {display: blockDisplay ? "block" : "flex", ...childSelfStyle} :
                    {display: "none", ...childSelfStyle}
            })
        })
    }

    return (
        <div
            className="tab-pad"
            style={{height}}
        >
            <div className="tab-label-pad">
                {renderLabel(labelArr)}
            </div>
            <div
                className="tab-container-pad"
                style={{overflowY: !allowScroll ? "auto" : "unset"}}
            >
                {renderContainer(children)}
            </div>
        </div>
    );
};
