import React, {useEffect, useRef, useState} from 'react';
import MarkDownEditor from "@/pages/main/publicComponent/markdownEditor";

import "./articleMarkDown.less";
import Upload from "@/basicComponent/Upload";
import Button from "@/basicComponent/Button";
import {createAndUpdateIntroductionData} from "@/api/v1/introduction";
import {showToast} from "@/utils/lightToast";
import useUploadImg from "@/customHook/useUploadImg";
import {editHighOrderCommunity} from "@/api/v1/community";
import {useHistory} from "react-router-dom";

interface Props {
    data: { [key: string]: any }
    flushData: () => void
}

const ArticleMarkDown: React.FC<Props> = (props) => {
    const {data, flushData} = props

    const {content, imgArray} = data ? data : {} as Props["data"]

    const [imgList, setImgList] = useState([])

    const markDownRef = useRef(null)

    const uploadImg = useUploadImg()

    const history = useHistory()

    useEffect(() => {
        setImgList([])
    }, [data])

    const submit = () => {
        if (!data?.id) {
            showToast("请先选中一篇内容", "error")
            return
        }
        const fetchData = {
            id: data.id,
            userId: data.userId,
            content: "",
            imgArray: [] as string[]
        }
        uploadImg(imgList, (result) => {
            fetchData.imgArray = result
            fetchData.content = markDownRef.current.articleContent
            editHighOrderCommunity(fetchData).then(res => {
                res.status === 200 && showToast("修改成功")
                setImgList([])
                flushData()
            })
        })
    }

    return (
        <div className="article-mark-down-container">
            <MarkDownEditor
                height={"calc(100% - 14rem)"}
                initializeValue={content ? content : ""}
                ref={markDownRef}
            />
            <div className="upload-img">
                <Upload
                    multiple={true}
                    maxFileLength={9}
                    onChange={(value) => {
                        value.length > 0 && setImgList(value)
                    }}
                    initializeFileUrlList={imgArray}
                    justifyContent={"flex-start"}
                    acceptFileType={"image/png,image/jpeg"}
                />
            </div>
            <div className="action-group">
                <Button onClick={() => {
                    history.push(`/main/details/${data.id}`)
                }}>
                    去原文
                </Button>
                <Button onClick={() => {
                    submit()
                }}>
                    提交修改
                </Button>
            </div>
        </div>
    );
};

export default ArticleMarkDown;