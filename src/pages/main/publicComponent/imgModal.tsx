import React, {useEffect, useState} from 'react';
import Modal from "@/basicComponent/Modal";
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";

import "./imgModal.less";
import Zoom from "@/pages/main/publicComponent/imgModalCom/zoom";

interface Props {
    visible: boolean
    setVisible: () => void
    imgArray: string[]
    initializeImgIndex: number
}

const ImgModal: React.FC<Props> = (props) => {

    const {visible, setVisible, imgArray, initializeImgIndex} = props

    const [selectedImgIndex, setSelectImgIndex] = useState(0)

    const [bigImgPosition, setBigImgPosition] = useState({
        height: 100, width: 100,
        top: 0, left: 0,
    })

    const [initializePosition, setInitializePosition] = useState({
        left: 0,
        top: 0
    })

    const [allowMove, setAllowMove] = useState(false)

    const isMobile = useSelector((store: ReduxRootType) => {
        return store.windowResizeReducer.isMobile
    })

    useEffect(() => {
        initBigImgPosition()
        setSelectImgIndex(initializeImgIndex)
    }, [initializeImgIndex])


    const initBigImgPosition = () => {
        setBigImgPosition({
            height: 100, width: 100,
            top: 0, left: 0,
        })
    }

    const renderImgSelectedPad = (imgArray: string[]) => {
        const length = imgArray?.length
        return imgArray.map((item, index) => {
            return <div
                className={"selected-img-pad-item"}
                style={{
                    width: `${100 / length}%`,
                    opacity: selectedImgIndex === index && "1"
                }}
                key={index}
                onClick={() => {
                    initBigImgPosition()
                    setSelectImgIndex(index)
                }}
            >
                <img src={item} alt={`selectedImgPadItem_${index}`}/>
            </div>
        })
    }

    return (
        isMobile ? <Zoom
            visible={visible}
            onClose={() => {
                setVisible()
            }}
            mainImg={imgArray[selectedImgIndex]}
        /> : <Modal
            visible={visible}
            onClose={() => {
                setVisible()
            }}
            width={"90vw"}
            height={isMobile ? "70vh" : "90vh"}
            disableDoubleClick={true}
        >
            <div className="detail-img-container">
                <div
                    className="show-big-img"
                    onWheel={(event) => {
                        const deltaY = event.deltaY
                        if (deltaY > 0) {
                            setBigImgPosition(prevState => ({
                                ...prevState,
                                width: prevState.width + 10,
                                height: prevState.height + 10
                            }))
                        } else {
                            const {width, height} = bigImgPosition
                            if (width > 10 && height > 10) {
                                setBigImgPosition(prevState => ({
                                    ...prevState,
                                    width: prevState.width - 10,
                                    height: prevState.height - 10
                                }))
                            }
                        }
                    }}
                >
                    <img
                        style={{
                            width: `${bigImgPosition.width}%`,
                            height: `${bigImgPosition.height}%`,
                            left: `${bigImgPosition.left}px`,
                            top: `${bigImgPosition.top}px`,
                        }}
                        onMouseDown={(event) => {
                            event.stopPropagation()
                            const {offsetX, offsetY} = event.nativeEvent
                            setInitializePosition({
                                top: offsetY,
                                left: offsetX
                            })
                            setAllowMove(true)
                        }}
                        onMouseMove={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            if (allowMove) {
                                const {offsetX, offsetY} = event.nativeEvent
                                const moveY = Math.floor(offsetY - initializePosition.top)
                                const moveX = Math.floor(offsetX - initializePosition.left)
                                setBigImgPosition({
                                    ...bigImgPosition,
                                    top: bigImgPosition.top + moveY,
                                    left: bigImgPosition.left + moveX
                                })
                            }
                        }}
                        onMouseUp={() => {
                            setAllowMove(false)
                        }}
                        src={imgArray[selectedImgIndex]}
                        alt="selectedImg"
                    />
                </div>
                <div className="selected-img-pad">
                    {renderImgSelectedPad(imgArray)}
                </div>
            </div>
        </Modal>
    );
}

export default ImgModal;