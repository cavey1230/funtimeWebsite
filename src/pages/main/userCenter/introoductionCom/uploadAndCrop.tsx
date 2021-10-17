import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import CropMainImg from "@/pages/main/userCenter/introoductionCom/cropMainImg";
import Upload from '@/basicComponent/Upload';

import "./uploadAndCrop.less";
import {ReactReduxContext, useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";

interface Props {
    onChange?: (file: any) => void
    mainImg: string
}

const UploadAndCrop: React.FC<Props & React.RefAttributes<any>> = forwardRef((
    props, ref
) => {
    const {onChange, mainImg} = props

    const [imgUrl, setImgUrl] = useState([])

    const isMobile = useSelector((store: ReduxRootType) => {
        return store.windowResizeReducer.isMobile
    })

    useImperativeHandle(ref, () => ({
        clear: () => {
            setImgUrl([])
        }
    }))

    useEffect(() => {
        setImgUrl([mainImg])
    }, [mainImg])

    return (
        <div className="upload-and-crop-container">
            <div className="upload-panel">
                <Upload
                    initializeFileUrlList={imgUrl}
                    maxFileLength={1}
                    acceptFileType={"image/png,image/jpeg"}
                    onChange={(value) => {
                        setImgUrl(value)
                    }}
                />
            </div>
            <div className="crop-panel">
                <CropMainImg
                    isAmplify={isMobile}
                    initializeImg={imgUrl}
                    limitBorderWidth={isMobile ? "160px" : "320px"}
                    limitBorderHeight={isMobile ? "300px" : "600px"}
                    onChange={(value, hasMove) => {
                        onChange && onChange(hasMove ? value : imgUrl)
                    }}
                />
            </div>
        </div>
    );
})

export default UploadAndCrop;