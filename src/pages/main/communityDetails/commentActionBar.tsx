import React, {useRef, useState} from 'react';
import Input from "@/basicComponent/Input";
import Button from '@/basicComponent/Button';
import {showToast} from "@/utils/lightToast";
import Loading from "@/basicComponent/Loading";
import {upload} from "@/api/v1/public";
import {blobToFile, dataURLtoBlob} from '@/utils/fileChanger';
import useLocalStorage from "@/customHook/useLocalStorage";
import { matchSpecialSymbol } from '@/utils/stringMatchingTool';

import {CameraIcon} from "@/assets/icon/iconComponent";

import "./commentActionBar.less";

export interface Props {
    flushDataFunc: () => void
    communityId: number
    onFinish: (
        communityId: number, userId: string, inputValue: string,
        init: () => void, argumentParams?: {
            commentId?: number,
            url?: string,
            replyId?: number
        }
    ) => void
    replyId?: number
    commentId?: number
}

export const CommentActionBar: React.FC<Props> = (props) => {

    const {flushDataFunc, communityId, onFinish, commentId, replyId} = props

    const [tipsVisible, setTipsVisible] = useState(true)

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [inputValue, setInputValue] = useState("")

    const [selectImgArray, setSelectImgArray] = useState([])

    const fileRef = useRef(null)

    const inputRef = useRef(null)

    const [getLocalStorage] = useLocalStorage()

    const userId = getLocalStorage("userId")

    const fileChange = async () => {
        const files = fileRef.current.files
        const innerShowToast = () => {
            showToast("最多只能添加1张图片", "error")
        }
        if (selectImgArray.length === 1) {
            innerShowToast()
            return
        }
        if (files[0] && files.length <= 1) {
            const length = files.length
            const innerImgUrlArray: any[] = []
            const getImgUrlOfPromise = (id: number) => {
                return new Promise((resolve) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(files[id])
                    reader.onload = () => {
                        const result = reader.result
                        resolve(result)
                    }
                })
            }
            for (let i = 0; i < length; i++) {
                const result = await getImgUrlOfPromise(i)
                innerImgUrlArray.push(result)
            }
            setSelectImgArray(innerImgUrlArray)
        } else {
            innerShowToast()
        }
    }

    const renderImgArray = (imgArray: typeof selectImgArray) => {
        const innerStyle = {
            width: "30%",
            height: "100%"
        }
        const length = imgArray.length
        if (length > 3 && length <= 6) {
            innerStyle.height = "49%"
        } else if (length > 6) {
            innerStyle.height = "30%"
        }
        if (length === 0) {
            return <div className="empty" children={"待添加图片..."}/>
        }
        return imgArray?.map((item, index) => {
            return <img
                style={innerStyle}
                key={index}
                src={item}
                alt={`img-item-${index}`}
                onClick={() => {
                    const innerImgArray = selectImgArray
                    innerImgArray.splice(index, 1)
                    setSelectImgArray([...innerImgArray])
                }}
            />
        })
    }

    const init = () => {
        setSelectImgArray([])
        setInputValue("")
        setLoadingVisible(false)
        setTipsVisible(true)
        inputRef.current.setValue("")
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
            const haveUrl = (url: string) => ({
                commentId: commentId || null,
                replyId: replyId || null,
                url: url
            })
            const notHaveUrl = () => ({
                commentId: commentId || null,
                replyId: replyId || null,
                url: ""
            })
            if (selectImgArray.length > 0) {
                const blob = dataURLtoBlob(selectImgArray[0])
                const file = blobToFile(blob, `${Date.now()}.jpeg`);
                const formData = new FormData()
                formData.append("file", file)
                upload(formData).then(res => {
                    if (res.status === 200) {
                        const url = res.url
                        onFinish(communityId, userId, inputValue, init, haveUrl(url))
                        return
                    }
                    init()
                })
                return
            }
            onFinish(communityId, userId, inputValue, init, notHaveUrl())
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
                        ref={inputRef}
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
                                width:"50%",
                                minWidth:"10rem",
                            }}
                            onClick={() => {
                                commitCommunity()
                            }}
                        >
                            发布评论
                        </Button>
                    </div>
                </div>
                <div className="selected-img-group">
                    <div
                        className="camera-icon"
                        onClick={() => {
                            fileRef.current.click()
                        }}
                    >
                        <CameraIcon/>
                        <input
                            type="file"
                            style={{display: "none"}}
                            ref={fileRef}
                            onClick={() => {
                                fileRef.current.value = ""
                            }}
                            onChange={() => {
                                fileChange()
                            }}
                            accept={"image/png,image/jpeg"}
                        />
                    </div>
                    {renderImgArray(selectImgArray)}
                </div>
            </div>
            <Loading visible={loadingVisible}/>
        </React.Fragment>
    );
};