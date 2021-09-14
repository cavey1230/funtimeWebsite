import React, {ReactElement, useEffect, useState} from "react";

import Button from "@/basicComponent/Button";
import {SearchIcon} from "@/assets/icon/iconComponent";

import "./Search.less";

interface Props {
    isReverse?: boolean
    width?: string
    maxHeight?: string
    backgroundColor?: string
    data?: { [key: string]: string | number }
    setCondition?: (obj: any) => void
    onFinish?: (obj: any) => void
}

type styleFunc = (isExpand: boolean, isReverse: boolean) => object

const Search: React.FC<Props> = (props) => {

    const {children, isReverse, width, maxHeight, backgroundColor, data, setCondition, onFinish} = props

    const [isExpand, setIsExpand] = useState(false)

    const [animationControl, setAnimationControl] = useState(false)

    useEffect(() => {
        if (isExpand) {
            localStorage.setItem("searchIsWheel", "false")
            setAnimationControl(true)
        } else {
            localStorage.setItem("searchIsWheel", "true")
            setTimeout(() => {
                setAnimationControl(false)
            }, 500)
        }
    }, [isExpand])

    const renderChildren = () => {
        return React.Children.only(
            React.cloneElement(children as ReactElement)
        )
    }

    const renderTargetItem = () => {
        return Object.keys(data).map((item, index) => {
            return <div
                key={index}
                className="target-container-item"
                onClick={() => {
                    setCondition({...data, [item]: ""})
                }}
            >
                {data[item]}
            </div>
        })
    }

    const conditionPadStyle: styleFunc = (isExpand, isReverse) => {
        return {
            ...(isExpand ? {
                maxHeight: maxHeight,
                animation: "1s search-fadeIn ease-in-out",
            } : {
                padding: 0,
                height: 0,
                // display:"none"
            }),
            ...(isReverse ? {
                bottom: "100%"
            } : {
                top: "100%"
            }),
            backgroundColor
        }
    }

    const searchPadStyle: styleFunc = (isExpand, isReverse) => {
        return {
            ...(isReverse ?
                {width, flexDirection: "column-reverse"} :
                {width, flexDirection: "column"})
        }
    }

    return (
        <div
            className="search-pad"
            style={searchPadStyle(isExpand, isReverse)}
        >
            <div
                onClick={(event) => {
                    event.preventDefault()
                    setIsExpand(prevState => !prevState)
                }}
                style={
                    isExpand ? {width: "50%"} : {width: "3rem"}
                }
                className="search-pad-input"
            >
                <SearchIcon/>
                {isExpand && <div className="search-pad-input-keywords">已选关键词</div>}
            </div>
            <div
                style={isExpand ? {width: "calc(100%)", height: "100%"} :
                    {width: "0", height: "0"}
                }
                className="target-container"
            >
                {renderTargetItem()}
            </div>
            <div
                style={isExpand ?
                    {width: "10rem", height: "100%", margin: "1rem 0"} :
                    {width: "0", height: "0"}
                }
                className="button-container"
            >
                <Button onClick={() => {
                    onFinish && onFinish(data)
                    setIsExpand(false)
                }}>
                    搜索
                </Button>
            </div>
            {
                animationControl && <div
                    style={conditionPadStyle(isExpand, isReverse)}
                    className="search-pad-condition-pad"
                >
                    {renderChildren()}
                </div>
            }
        </div>
    );
}

export default Search;