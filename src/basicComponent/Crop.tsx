import React, {useRef, useState, useEffect, useCallback, useImperativeHandle} from 'react';

import {blobToFile, dataURLtoBlob} from '@/customHook/useUploadImg';

import "./Crop.less";

interface Props {
    imgSrc: any
    timestamp: number
    cropImgWidth: number | string
    cropImgHeight: number | string
    onFinish: (data: any) => void
}

interface InitializeBoxSize {
    containerWidth: number
    containerHeight: number
}

const Crop: React.FC<Props & React.RefAttributes<any>> = React.forwardRef((props, ref) => {
    const {
        imgSrc, cropImgHeight, cropImgWidth,
        timestamp, onFinish
    } = props

    //图片外层容器大小
    const [containerBase, setContainerBase] = useState({
        width: 0,
        height: 0
    })

    //裁剪框大小
    const [sizeBoxBase, setSizeBoxBase] = useState({
        width: 0,
        height: 0,
        left: 0,
        top: 0
    })

    //裁剪框鼠标初始位置
    const [initializePosition, setInitializePosition] = useState({
        left: 0,
        top: 0
    })

    //点击拉伸方块时鼠标位置
    const [boxInitializePosition, setBoxInitializePosition] = useState({
        left: 0,
        top: 0
    })

    //大图base64数据
    const [imgBase64, setImgBase64] = useState()

    //裁剪后得到的base64数据
    const [cropImgBase64, setCropImgBase64] = useState()

    //控制裁剪框移动
    const [allowMove, setAllowMove] = useState(false)

    //控制裁剪宽伸缩
    const [allowReSize, setAllowReSize] = useState(false)

    //图片外容器ref
    const imgContainerRef = useRef(null)

    //大图图片ref
    const initializeCanvasRef = useRef(null)

    //缩略图ref
    const canvas = useRef(null)

    useImperativeHandle(ref, () => ({
        getFile: () => {
            return cropImgBase64 ? blobToFile(dataURLtoBlob(cropImgBase64), `${Date.now()}.jpeg`) : null
        }
    }))

    useEffect(() => {
        if (imgContainerRef.current && imgSrc) {
            //拿到外层容器真实大小(非像素)
            const {clientWidth, clientHeight} = imgContainerRef.current
            const initializeCanvas = initializeCanvasRef.current
            if (initializeCanvas.getContext) {
                const ctx = initializeCanvas.getContext("2d")
                ctx.clearRect(0, 0, clientWidth, clientHeight);
                const img = new Image()
                img.src = imgSrc as string
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, clientWidth, clientHeight)
                    const imgData = initializeCanvas.toDataURL()
                    setImgBase64(imgData)
                }
            }
            setContainerBase({
                width: clientWidth, height: clientHeight
            })
            setSizeBoxStyle({
                containerWidth: clientWidth, containerHeight: clientHeight,
            })
        }
    }, [timestamp])

    useEffect(() => {
        if (imgBase64) {
            canvasOperation()
        }
    }, [imgBase64])

    const setSizeBoxStyle = useCallback((data: InitializeBoxSize) => {
        const {containerHeight, containerWidth} = data
        setSizeBoxBase({
            width: Math.floor(containerHeight / 2),
            height: Math.floor(containerHeight / 2),
            left: Math.floor(containerWidth / 2 - containerWidth / 4),
            top: Math.floor(containerHeight / 2 - containerHeight / 4)
        })
    }, [])

    const cropHeightAndWidth = useCallback(() => ({
        width: cropImgWidth,
        height: cropImgHeight
    }), [])

    const oneSecondCropHeightAndWidth = useCallback(() => {
        const replacePx = (rem: string) => {
            return (Number(rem.match(/\d+/)[0]) / 2).toFixed(2)
        }
        return {
            width: replacePx(cropImgWidth as string),
            height: replacePx(cropImgHeight as string)
        }
    }, [])

    const mouseDown = (
        event: React.MouseEvent | React.TouchEvent,
        type: "move" | "resize" | "touchStart"
    ) => {
        event.stopPropagation()
        let offsetX
        let offsetY
        if (type !== "touchStart") {
            offsetX = (event as React.MouseEvent).nativeEvent.offsetX
            offsetY = (event as React.MouseEvent).nativeEvent.offsetY
        } else {
            offsetX = (event as React.TouchEvent).changedTouches[0].pageX
            offsetY = (event as React.TouchEvent).changedTouches[0].pageY
        }
        if (type === "move") {
            setInitializePosition({
                top: offsetY,
                left: offsetX
            })
            setAllowMove(true)
        }
        if (type === "resize") {
            setBoxInitializePosition({
                top: offsetY,
                left: offsetX
            })
            setAllowReSize(true)
        }
    }

    const mouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault()
        event.stopPropagation()
        if (allowMove) {
            //框选容器的 宽高以及边距
            const {top, left, width, height} = sizeBoxBase
            //外层容器的 宽高
            const {width: containerWidth, height: containerHeight} = containerBase

            const {offsetX, offsetY} = event.nativeEvent
            const moveY = Math.floor(offsetY - initializePosition.top)
            const moveX = Math.floor(offsetX - initializePosition.left)

            if ((top + height) > containerHeight) {
                setSizeBoxBase({
                    ...sizeBoxBase,
                    top: containerHeight - height - 1,
                })
                setAllowMove(false)
                return
            }

            if ((left + width) > containerWidth) {
                setSizeBoxBase({
                    ...sizeBoxBase,
                    left: containerWidth - width - 1
                })
                setAllowMove(false)
                return
            }

            if (left < 0) {
                setSizeBoxBase({
                    ...sizeBoxBase,
                    left: 1
                })
                setAllowMove(false)
                return
            }

            if (top < 0) {
                setSizeBoxBase({
                    ...sizeBoxBase,
                    top: 1
                })
                setAllowMove(false)
                return
            }

            setSizeBoxBase({
                ...sizeBoxBase,
                top: sizeBoxBase.top + moveY,
                left: sizeBoxBase.left + moveX
            })
        }
    }

    const mouseMoveOfResize = (event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        if (allowReSize) {
            //框选容器的 宽高以及边距
            const {top, left, width, height} = sizeBoxBase
            //外层容器的 宽高
            const {width: containerWidth, height: containerHeight} = containerBase

            const {offsetX, offsetY} = event.nativeEvent
            const moveY = Math.floor(offsetY - boxInitializePosition.top)
            const moveX = Math.floor(offsetX - boxInitializePosition.left)

            if ((top + height) > containerHeight) {
                setSizeBoxBase({
                    ...sizeBoxBase,
                    height: containerHeight - top - 1
                })
                setAllowReSize(false)
                return
            }

            if ((left + width) > containerWidth) {
                setSizeBoxBase({
                    ...sizeBoxBase,
                    width: containerWidth - left - 1
                })
                setAllowReSize(false)
                return
            }

            if (width < 0) {
                setSizeBoxBase({
                    ...sizeBoxBase,
                    width: 1
                })
                setAllowReSize(false)
                return
            }

            if (height < 0) {
                setSizeBoxBase({
                    ...sizeBoxBase,
                    height: 1
                })
                setAllowReSize(false)
                return
            }

            setSizeBoxBase({
                ...sizeBoxBase,
                width: width + moveX,
                height: height + moveY
            })
        }
    }

    const canvasOperation = () => {
        const canvasCurrent = canvas.current
        const clientWidth = canvasCurrent.clientWidth
        const clientHeight = canvasCurrent.clientHeight
        if (canvasCurrent.getContext) {
            const ctx = canvasCurrent.getContext("2d")
            ctx.clearRect(0, 0, clientWidth, clientHeight);
            const img = new Image()
            img.src = imgBase64
            img.onload = () => {
                const {left, top, width, height} = sizeBoxBase
                ctx.drawImage(img, left, top, width, height,
                    0, 0, width, height)
                const imgData = canvasCurrent.toDataURL("image/jpeg")
                setCropImgBase64(imgData)
            }
        } else {
            console.error("未取得canvas上下文")
        }
    }

    //重置图片源
    const init = () => {
        setImgBase64(null)
    }

    return <div className="crop-pad">
        <div className="crop-operation-pad">
            <div
                ref={imgContainerRef}
                className="initialize-picture"
            >
                <canvas
                    ref={initializeCanvasRef}
                    width={cropImgWidth}
                    height={cropImgHeight}
                >
                    你的浏览器不支持canvas请升级浏览器
                </canvas>
            </div>
            <div
                className="crop-size-box-background"
                style={cropHeightAndWidth()}
            >
                {!imgBase64 && <div className="crop-size-box-tips">
                    请点击下方上传图片,进行裁剪。
                </div>}
                {imgBase64 && <React.Fragment>
                    <div
                        onMouseDown={(event) => {
                            mouseDown(event, "move")
                        }}
                        onTouchStart={(event) => {
                            mouseDown(event, "move")
                        }}
                        onMouseMove={mouseMove}
                        onMouseUp={() => {
                            canvasOperation()
                            setAllowMove(false)
                        }}
                        onMouseOut={() => {
                            canvasOperation()
                            setAllowMove(false)
                        }}
                        style={sizeBoxBase}
                        className="crop-size-box"
                    />
                    <div
                        className="expansion-target"
                        style={{
                            top: `calc(${sizeBoxBase.top + sizeBoxBase.height}px - 10%)`,
                            left: `calc(${sizeBoxBase.left + sizeBoxBase.width}px - 10%)`
                        }}
                        onMouseDown={(event) => {
                            mouseDown(event, "resize")
                        }}
                        onMouseMove={mouseMoveOfResize}
                        onMouseUp={() => {
                            canvasOperation()
                            setAllowReSize(false)
                        }}
                        onMouseOut={() => {
                            canvasOperation()
                            setAllowReSize(false)
                        }}
                    />
                </React.Fragment>}
            </div>
            <div className="thumbnail-pad">
                <div className="title">
                    <span>预览</span>
                </div>
                <div style={{
                    width: `calc(${cropImgWidth} / 2)`,
                    height: `calc(${cropImgHeight} / 2)`
                }} className="thumbnail">
                    <canvas
                        ref={canvas}
                        width={oneSecondCropHeightAndWidth().width}
                        height={oneSecondCropHeightAndWidth().height}
                    >
                        你的浏览器不支持canvas请升级浏览器
                    </canvas>
                </div>
            </div>
        </div>
    </div>
})

export default Crop;