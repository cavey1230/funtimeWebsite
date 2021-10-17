import React, {useEffect, useState} from 'react';
import {CloseIcon} from "@/assets/icon/iconComponent";
import getDom from '@/utils/getDom';

import "./zoom.less";

interface Props {
    mainImg: string
    visible: boolean
    onClose: () => void
}

type PageXAndPageY = { pageX: number, pageY: number }

const Zoom: React.FC<Props> = (props) => {
    const {mainImg, visible, onClose} = props

    const [scrollTop, setScrollTop] = useState(0)

    const originTouchList: Array<React.Touch> = []

    const initiallyStartTouch = {
        initiallyTransformX: 0,
        initiallyTransformY: 0
    }

    useEffect(() => {
        setScrollTop(document.body.scrollTop)
        if (visible) {
            document.body.style.overflowY = "hidden"
            document.body.scrollTo({
                top: 0
            })
        }
    }, [visible])

    const scaleReference = (p1: PageXAndPageY, p2: PageXAndPageY) => {
        const x = p2.pageX - p1.pageX,
            y = p2.pageY - p1.pageY;
        return Math.sqrt((x * x) + (y * y));
    }

    return (
        visible && <div className="zoom-container">
            <div
                className="close-button"
                onClick={() => {
                    onClose()
                    document.body.style.overflowY = "auto"
                    document.body.scrollTo({
                        top: scrollTop
                    })
                }}>
                <CloseIcon/>
            </div>
            <div id="console">111</div>
            <div className="zoom-img-container">
                <img
                    id="zoom-img"
                    style={{transform: "translateX(0px) translateY(0px) scale(1)"}}
                    src={mainImg}
                    alt="mainImg"
                    onTouchStart={(event) => {
                        const changedTouches = event.changedTouches
                        const changedTouchesLength = changedTouches.length
                        new Array(changedTouchesLength).fill(1).map((_, index) => {
                            originTouchList.push(changedTouches[index])
                        })
                        const zoomImgDom = getDom("zoom-img")
                        const innerRegExp = new RegExp(/(-?[0-9]+)px/g)
                        const [initiallyX, initiallyY] = zoomImgDom.style.transform
                            .match(innerRegExp)?.map((item) => {
                                return Number(item.replace(innerRegExp, '$1'))
                            })
                        initiallyStartTouch.initiallyTransformX = initiallyX
                        initiallyStartTouch.initiallyTransformY = initiallyY
                    }}
                    onTouchMove={(event) => {
                        const {initiallyTransformX, initiallyTransformY} = initiallyStartTouch
                        const zoomImgDom = getDom("zoom-img")
                        const updateTouchList = event.changedTouches
                        const firstPageXAndYOfDoubleFinger = {
                            pageX: 0,
                            pageY: 0
                        }
                        new Array(updateTouchList.length).fill(1).forEach((_, index) => {
                            const touchItem = updateTouchList[index]
                            const findResult = originTouchList.find((item) => {
                                return item.identifier === touchItem.identifier
                            })
                            if (findResult && originTouchList.length === 1) {
                                getDom("console").innerText = String("单指")
                                const distancePageX = touchItem.pageX - findResult.pageX
                                const distancePageY = touchItem.pageY - findResult.pageY
                                const originTransform = zoomImgDom.style.transform
                                const innerRegexp = new RegExp(/scale\((.+)\)/g)
                                const scaleStr = originTransform.match(innerRegexp)[0]
                                getDom("console").innerText = String(scaleStr)
                                zoomImgDom.style.transform =
                                    `translateX(${initiallyTransformX + distancePageX}px)` +
                                    `translateY(${initiallyTransformY + distancePageY}px)` +
                                    scaleStr
                            }
                            if (findResult && originTouchList.length === 2) {
                                getDom("console").innerText = String("双指中")
                                if (index === 0) {
                                    firstPageXAndYOfDoubleFinger.pageX = touchItem.pageX
                                    firstPageXAndYOfDoubleFinger.pageY = touchItem.pageY
                                } else if (index === 1) {
                                    const scale1 = scaleReference(originTouchList[0], originTouchList[1])
                                    const scale2 = scaleReference(firstPageXAndYOfDoubleFinger, findResult)
                                    const originTransform = zoomImgDom.style.transform
                                    const innerRegexp = new RegExp(/scale\((.+)\)/g)
                                    const originScale = originTransform.match(innerRegexp)[0].replace(innerRegexp, "$1")
                                    const originScaleNum = Number(originScale)
                                    const transformStr = originTransform.replace(innerRegexp, "")
                                    if (originScaleNum >= 0.5 && originScaleNum <= 3) {
                                        zoomImgDom.style.transform = (scale1 < scale2) ?
                                            transformStr + `scale(${Number(originScaleNum) + 0.05})` :
                                            transformStr + `scale(${Number(originScaleNum) - 0.05})`
                                    } else {
                                        zoomImgDom.style.transform = transformStr + `scale(1)`
                                    }
                                }
                            }
                        })
                    }}
                    onTouchEnd={(event) => {
                        originTouchList.splice(0, originTouchList.length)
                        initiallyStartTouch.initiallyTransformX = 0
                        initiallyStartTouch.initiallyTransformY = 0
                    }}/>
            </div>
        </div>
    )
}

export default Zoom;