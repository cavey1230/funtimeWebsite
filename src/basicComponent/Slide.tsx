import React, {CSSProperties, useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import classnames from '@/utils/classnames';

import "./Slide.less";

interface Props {
    data: Array<{
        mainImg: string,
        address: string,
        mainTitle: string,
        subTitle: string
    }>
    delay: number
    maxWidth?: string
    minWidth?: string
    height: string
    thumbnailPosition?: CSSProperties["justifyContent"]
    fullWidth?: boolean
    top?: string | number
    mainTitleFontSize: string
    subTitleFontSize: string
    margin?: string
}

const Slide: React.FC<Props> = (props) => {
    const {
        delay, data, height, minWidth, margin,
        maxWidth, thumbnailPosition, fullWidth,
        top, mainTitleFontSize, subTitleFontSize
    } = props

    const innerDelay = delay ? delay : 5000

    const [selectedIndex, setSelectedIndex] = useState(0)

    const [preImg, setPreImg] = useState("")

    const history = useHistory()

    useEffect(() => {
        const setTimeOutId = setTimeout(() => {
            if (selectedIndex + 1 === data.length) {
                setPreImg(data[data.length - 1].mainImg)
                setSelectedIndex(0)
            } else {
                setPreImg(data[selectedIndex].mainImg)
                setSelectedIndex(selectedIndex + 1)
            }
        }, innerDelay)
        return () => {
            clearTimeout(setTimeOutId)
        }
    }, [selectedIndex, data])

    return (
        <div
            className="slide-most-out-container"
            style={{top, margin, position: fullWidth ? "fixed" : "relative"}}
        >
            <div className="slide-container" style={{height}}>
                <div className="img-group" style={{height}}>
                    {data?.length > 0 && data.map((item, index) => {
                        const isSelected = index === selectedIndex
                        const {mainImg, address, mainTitle, subTitle} = item
                        return <div
                            key={index}
                            className={classnames("img-item", {
                                "img-item-selected": isSelected
                            })}
                            onClick={() => {
                                history.push(address)
                            }}
                        >
                            {preImg && <img
                                className="img-leave"
                                src={preImg}
                                alt="img"
                            />}
                            <img className={classnames({
                                "img-in": preImg && isSelected
                            })} src={mainImg} alt="img"/>
                            <div className="img-item-curtain"/>
                            <div
                                className={classnames("img-item-recommend", {
                                    "init-have-left": !preImg,
                                    "img-item-recommend-selected": preImg && isSelected
                                })}
                                style={{maxWidth, minWidth}}
                            >
                                <div
                                    style={{fontSize: mainTitleFontSize}}
                                    className={classnames({
                                        "init-have-left": !preImg
                                    })}
                                >
                                    {mainTitle}
                                </div>
                                <div
                                    style={{fontSize: subTitleFontSize}}
                                    className={classnames({
                                        "init-have-left": !preImg
                                    })}
                                >
                                    {subTitle}
                                </div>
                            </div>
                        </div>
                    })}
                </div>
                <div
                    style={{maxWidth, minWidth, justifyContent: thumbnailPosition}}
                    className="thumbnail-group"
                >
                    {data?.length > 0 && data.map((item, index) => {
                        return <div
                            key={index}
                            onClick={() => {
                                setPreImg(data[index === 0 ? data.length - 1 : index - 1].mainImg)
                                setSelectedIndex(index)
                            }}
                            className={classnames("thumbnail-item", {
                                "thumbnail-item-selected": index === selectedIndex
                            })}
                        />
                    })}
                </div>
            </div>
        </div>
    );
}


export default Slide;