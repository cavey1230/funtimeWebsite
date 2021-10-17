import React, {useRef, useState} from 'react';
import Input from "@/basicComponent/Input";
import Button from '@/basicComponent/Button';
import {showToast} from "@/utils/lightToast";
import Loading from "@/basicComponent/Loading";
import useLocalStorage from "@/customHook/useLocalStorage";
import Upload from "@/basicComponent/Upload";
import useUploadImg from "@/customHook/useUploadImg";

import "./commentActionBar.less";

export interface Props {
    flushDataFunc: () => void
    communityId: number
    onFinish: (
        communityId: number, userId: string, inputValue: string,
        init: () => void, argumentParams?: {
            commentId?: number,
            url?: string[],
            replyId?: number
        }
    ) => void
    replyId?: number
    commentId?: number
    maxImgLength: number
}

export const CommentActionBar: React.FC<Props> = (props) => {

    const {
        flushDataFunc, communityId, onFinish,
        commentId, replyId, maxImgLength
    } = props

    const [tipsVisible, setTipsVisible] = useState(true)

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [inputValue, setInputValue] = useState("")

    const [selectImgArray, setSelectImgArray] = useState([])

    const uploadRef = useRef(null)

    const [getLocalStorage] = useLocalStorage()

    const upLoadImg = useUploadImg()

    const userId = getLocalStorage("userId")

    const init = () => {
        setSelectImgArray([])
        setInputValue("")
        setLoadingVisible(false)
        setTipsVisible(true)
        uploadRef.current && uploadRef.current.clear()
        flushDataFunc()
    }

    //提交操作
    const commitCommunity = () => {
        if (!inputValue && selectImgArray.length === 0) {
            showToast("图片和文字必须填一项", "warn")
            return
        }
        setLoadingVisible(true)
        setTimeout(() => {
            const haveUrl = (url: string[]) => ({
                commentId: commentId || null,
                replyId: replyId || null,
                url: url?.length > 0 ? url : []
            })
            const onfinishWithUrl = (urlList?: string[]) => {
                onFinish(communityId, userId, inputValue, init, haveUrl(urlList))
            }
            selectImgArray.length > 0 ? upLoadImg(selectImgArray, urlList => {
                urlList?.length > 0 ? onfinishWithUrl(urlList) : init()
            }) : onfinishWithUrl()
        }, 1000)
    }

    return (
        <React.Fragment>
            <div className="comment-action-bar-pad publicFadeIn">
                <div className="input-action-pad">
                    <Input
                        style={{
                            border: "none",
                            fontSize: "1.6rem",
                            fontWeight: 600
                        }}
                        placeholder={""}
                        onChange={result => {
                            if ((result as string).length > 200) {
                                showToast("字符超过最大限制,超出部分会进行删减", "error")
                                return
                            }
                            setInputValue(result as string)
                        }}
                        noFocusStyle={true}
                        textAreaMode={true}
                        width={"100%"}
                        height={"100%"}
                        onFocus={() => {
                            setTipsVisible(false)
                        }}
                        onBlur={() => {
                            setTipsVisible(true)
                        }}
                        initializeValue={inputValue}
                    />
                    {
                        inputValue.length === 0 && tipsVisible &&
                        <div className="text-area-tips">
                            请输入待发表内容
                        </div>
                    }
                </div>
                <div className="topic-action-pad">
                    <div className="right-pad">
                        {inputValue.length > 0 && <div className="text-number-limit">
                            {`${inputValue.length}/200`}
                        </div>}
                        <Button
                            style={{
                                width: "50%",
                                minWidth: "10rem",
                            }}
                            onClick={() => {
                                commitCommunity()
                            }}
                        >
                            发布评论
                        </Button>
                    </div>
                </div>
                <Upload
                    ref={uploadRef}
                    onChange={(res) => {
                        setSelectImgArray(res)
                    }}
                    multiple={true}
                    maxFileLength={maxImgLength}
                    justifyContent={"flex-start"}
                    acceptFileType={"image/png,image/jpeg"}
                />
            </div>
            <Loading visible={loadingVisible}/>
        </React.Fragment>
    );
};