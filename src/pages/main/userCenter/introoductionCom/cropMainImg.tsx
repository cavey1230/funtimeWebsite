import Input from '@/basicComponent/Input';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Button from "@/basicComponent/Button";

import "./cropMainImg.less";

interface Props {
    initializeImg: string[]
    limitBorderWidth: string
    limitBorderHeight: string
    onChange: (file: any, hasMove: boolean) => void
    isAmplify: boolean
}

const CropMainImg: React.FC<Props> = (props) => {
    const {
        initializeImg, limitBorderWidth,
        limitBorderHeight, onChange, isAmplify
    } = props

    const canvasRef = useRef(null)

    //最外层ref
    const outContainerRef = useRef(null)

    //对比框ref
    const limitBorderRef = useRef(null)

    //缩略图
    const thumbnailRef = useRef(null)

    //缩放比例
    const [scale, setScale] = useState(1)

    //canvas实际图片大小
    const [imgSize, setImgSize] = useState({
        width: 0,
        height: 0
    })

    //canvas偏移量
    const [canvasPosition, setCanvasPosition] = useState({
        left: 0,
        top: 0
    })

    //外层容器实际大小
    const [clientPosition, setClientPosition] = useState({
        clientX: 0,
        clientY: 0
    })

    //中间对比框实际偏移量 最外层的一半减去对比框宽度一半
    const [limitBorderPosition, setLimitBorderPosition] = useState({
        left: 0,
        top: 0
    })

    //是否允许移动
    const [allowMove, setAllowMove] = useState(false)

    //file
    const [imgFile, setImgFile] = useState("")

    const limitBorderSize = useMemo(() => {
        const replaceLimitBorder = (str: string) => {
            return Number(str.match(/\d+/)[0])
        }
        return {
            width: replaceLimitBorder(limitBorderWidth),
            height: replaceLimitBorder(limitBorderHeight)
        }
    }, [limitBorderWidth, limitBorderHeight])

    useEffect(() => {
        renderMainCanvas()
    }, [initializeImg, scale])

    useEffect(() => {
        setScale(1)
    }, [initializeImg])

    const renderMainCanvas = () => {
        if ((canvasRef.current && initializeImg.length > 0)) {
            //拿到外层容器真实大小(非像素)
            const initializeCanvas = canvasRef.current
            if (initializeCanvas.getContext) {
                const ctx = initializeCanvas.getContext("2d")
                ctx.clearRect(0, 0, imgSize.width, imgSize.height);
                const img = new Image()
                img.src = initializeImg[0]
                img.setAttribute("crossOrigin", 'Anonymous')
                img.onload = () => {
                    const {width: imgWidth, height: imgHeight} = img
                    //乘上缩放比例
                    const width = imgWidth * scale
                    const height = imgHeight * scale
                    setImgSize({width, height})
                    ctx.drawImage(img, 0, 0, width, height)
                    const current = outContainerRef.current
                    const limitBorderObject = {
                        left: current.clientWidth / 2 - limitBorderSize.width / 2,
                        top: current.clientHeight / 2 - limitBorderSize.height / 2
                    }
                    setLimitBorderPosition(limitBorderObject)
                    const innerPosition = isAmplify ? {left: 0, top: 0} :
                        limitBorderObject
                    setCanvasPosition(innerPosition)
                    const imgData = initializeCanvas.toDataURL("image/jpeg")
                    setImgFile(imgData)
                    renderThumbnailCanvas({
                        base64: imgData,
                        limitObject: innerPosition
                    })
                }
            }
        }
    }

    const renderThumbnailCanvas = (paramObject?: {
        base64: string,
        limitObject: { left: number, top: number }
    }) => {
        if (thumbnailRef.current && initializeImg.length > 0) {
            //拿到外层容器真实大小(非像素)
            const thumbnailCanvas = thumbnailRef.current
            if (thumbnailCanvas.getContext) {
                const ctx = thumbnailCanvas.getContext("2d")
                //传入的初始大小
                const {width, height} = limitBorderSize
                const limitObject = paramObject?.limitObject
                const limitObjectLength = paramObject ? Object.keys(limitObject).length : 0
                //如果有传入的位置信息,则使用传入位置信息,如果没有就读取当前位置信息(主图无更改时)
                const canvasLeft = limitObjectLength > 0 ?
                    limitObject.left : canvasPosition.left
                const canvasTop = limitObjectLength > 0 ?
                    limitObject.top : canvasPosition.top
                const limitLeft = limitObjectLength > 0 ?
                    limitObject.left : limitBorderPosition.left
                const limitTop = limitObjectLength > 0 ?
                    limitObject.top : limitBorderPosition.top
                const renderWidth = isAmplify ? width * 2 : width
                const renderHeight = isAmplify ? height * 2 : height
                const finallyLeft = isAmplify ? -canvasLeft : (limitLeft - canvasLeft)
                const finallyTop = isAmplify ? -canvasTop : (limitTop - canvasTop)
                ctx.clearRect(0, 0, renderWidth, renderHeight);
                const img = new Image()
                //如果有传入的base64 就立即使用该数据，不然就去读取当前保存的imgFile，
                //这样做能够让组件在第一次渲染的时候就把图片信息展示出来
                img.src = paramObject?.base64 ? paramObject.base64 : imgFile
                img.onload = () => {
                    ctx.drawImage(img, finallyLeft, finallyTop,
                        renderWidth, renderHeight, 0, 0, renderWidth, renderHeight)
                    const imgData = thumbnailCanvas.toDataURL("image/jpeg")
                    //onChange 第二个参数描述位置变化信息，有变化才把取得base64，发回给父组件
                    //外边的upload方法上传时会自动判断，是url链接，还是base64，是base64才上传
                    if (isAmplify && onChange) {
                        onChange([imgData], canvasLeft !== 0 || canvasTop !== 0)
                    }
                    if (!isAmplify && onChange) {
                        onChange([imgData], canvasLeft !== limitLeft || canvasTop !== limitTop)
                    }
                }
            }
        }
    }

    const init = () => {
        setAllowMove(false)
        renderThumbnailCanvas()
    }

    return (
        <div className="crop-main-img-out-container">
            <div
                ref={outContainerRef}
                className="crop-main-img-container"
                style={{
                    height: isAmplify ?
                        `calc(${limitBorderHeight} * 2)` :
                        `calc(${limitBorderHeight} + 100px)`
                }}
            >
                <div
                    className="limit-container"
                    ref={limitBorderRef}
                    style={isAmplify ? {
                        border: "none"
                    } : {
                        width: limitBorderWidth,
                        height: limitBorderHeight,
                        ...limitBorderPosition
                    }}
                />
                <div
                    className="canvas-container"
                    onMouseDown={(event) => {
                        event.preventDefault()
                        setClientPosition({
                            clientX: event.clientX,
                            clientY: event.clientY
                        })
                        setAllowMove(true)
                    }}
                    onTouchStart={(event) => {
                        document.body.style.overflowY = "hidden"
                        const touchPoint = event.changedTouches[0]
                        setClientPosition({
                            clientX: touchPoint.pageX,
                            clientY: touchPoint.pageY
                        })
                        setAllowMove(true)
                    }}
                    onMouseMove={(event) => {
                        event.preventDefault()
                        if (!allowMove) return
                        const distanceY = event.clientY - clientPosition.clientY
                        const distanceX = event.clientX - clientPosition.clientX
                        setCanvasPosition({
                            left: canvasPosition.left + distanceX,
                            top: canvasPosition.top + distanceY
                        })
                        setClientPosition({
                            clientX: event.clientX,
                            clientY: event.clientY
                        })
                    }}
                    onTouchMove={(event) => {
                        if (!allowMove) return
                        const touchPoint = event.changedTouches[0]
                        const distanceY = touchPoint.pageY - clientPosition.clientY
                        const distanceX = touchPoint.pageX - clientPosition.clientX
                        setCanvasPosition({
                            left: canvasPosition.left + distanceX,
                            top: canvasPosition.top + distanceY
                        })
                        setClientPosition({
                            clientX: touchPoint.pageX,
                            clientY: touchPoint.pageY
                        })
                    }}
                    onTouchEnd={(event) => {
                        event.preventDefault()
                        document.body.style.overflowY = "auto"
                        init()
                    }}
                    onMouseUp={(event) => {
                        event.preventDefault()
                        init()
                    }}
                    onMouseLeave={(event) => {
                        event.preventDefault()
                        init()
                    }}
                    style={{
                        top: canvasPosition.top,
                        left: canvasPosition.left
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        width={imgSize.width}
                        height={imgSize.height}
                    >
                        你的浏览器不支持canvas请升级浏览器
                    </canvas>
                </div>
                <div className="tips">
                    {isAmplify ? "拖动背景图片,把想展示的拖动至画面内,移动端会有偏差" :
                        "拖动背景图片,想展示的位置至红框内,移动端会有偏差"}
                </div>
            </div>
            <div className="scale-input">
                <span>背景图比例</span>
                <Input
                    onChange={(value) => {
                        setScale(Number(value))
                    }}
                    width={"15rem"}
                    placeholder={"缩小放大比例"}
                    initializeValue={scale.toFixed(1)}
                    noFocusStyle={true}
                />
            </div>
            <div className="button-group">
                <Button onClick={() => {
                    setScale(scale + 0.1)
                }}>
                    增大
                </Button>
                <Button onClick={() => {
                    setScale(scale - 0.1)
                }}>
                    缩小
                </Button>
                <Button onClick={() => {
                    setScale(1)
                }}>
                    原比例
                </Button>
            </div>
            <canvas
                width={isAmplify ? `${limitBorderSize.width * 2}` :
                    `${limitBorderSize.width}`}
                height={isAmplify ? `${limitBorderSize.height * 2}` :
                    `${limitBorderSize.height}`}
                style={{
                    position: "absolute",
                    top: "-100%",
                    aspectRatio: "initial"
                }}
                ref={thumbnailRef}
            >
                你的浏览器不支持canvas请升级浏览器
            </canvas>
        </div>
    );
};

export default CropMainImg;