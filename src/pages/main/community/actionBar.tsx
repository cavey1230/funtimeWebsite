import React, {useRef, useState} from 'react';
import Input from "@/basicComponent/Input";
import Button from '@/basicComponent/Button';
import TopicModal from "./actionBarCom/topicModal";
import {showToast} from "@/utils/lightToast";
import Loading from "@/basicComponent/Loading";
import {upload} from "@/api/v1/public";
import {blobToFile, dataURLtoBlob} from '@/utils/fileChanger';
import useLocalStorage from "@/customHook/useLocalStorage";
import {createCommunity} from "@/api/v1/community";
import {CameraIcon, TopicIcon} from "@/assets/icon/iconComponent";
import {matchSpecialSymbol} from "@/utils/stringMatchingTool";
import MarkDownEditor from "@/pages/main/publicComponent/markdownEditor";

import "./actionBar.less";

interface Props {
    flushDataFunc: () => void
}

const ActionBar: React.FC<Props> = (props) => {

    const {flushDataFunc} = props

    const [tipsVisible, setTipsVisible] = useState(true)

    const [topicVisible, setTopicVisible] = useState(false)

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [editorModel, setEditorModel] = useState(false)

    const [selectTopic, setSelectTopic] = useState({
        title: "",
        id: 0
    })

    const [inputValue, setInputValue] = useState("")

    const [selectImgArray, setSelectImgArray] = useState([])

    const fileRef = useRef(null)

    const inputRef = useRef(null)

    const markDownRef = useRef(null)

    const [getLocalStorage] = useLocalStorage()

    const fileChange = async () => {
        const files = fileRef.current.files
        const innerShowToast = () => {
            showToast("最多只能添加9张图片", "error")
        }
        if (selectImgArray.length === 9) {
            innerShowToast()
            return
        }
        if (files[0] && files.length <= 9) {
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
            return <div className="empty" children={"点击相机添加图片"}/>
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
        inputRef.current && inputRef.current.setValue("")
        markDownRef.current && markDownRef.current.setArticleContent("")
        flushDataFunc()
    }

    //动态提交操作
    const commitCommunity = () => {
        const userId = getLocalStorage("userId")
        if (!userId) {
            showToast("请登录", "error")
            return
        }
        if (!editorModel && !inputValue && selectImgArray.length === 0) {
            showToast("图片和文字必须填一项", "warn")
            return
        }
        if (editorModel && !markDownRef.current.articleContent) {
            showToast("文章信息为空，无法提交", "error")
            return
        }
        setLoadingVisible(true)
        setTimeout(() => {
            const imgUrlArray = Promise.all(selectImgArray.map(item => {
                return new Promise((resolve, reject) => {
                    const file = blobToFile(dataURLtoBlob(item), `${Date.now()}.jpeg`);
                    const formData = new FormData()
                    formData.append("file", file)
                    upload(formData).then(res => {
                        if (res.status === 200) {
                            resolve(res.url)
                        } else {
                            reject("发生错误")
                        }
                    })
                })
            }))
            imgUrlArray.then(res => {
                const {id} = selectTopic
                const innerContent = editorModel ? markDownRef.current.articleContent : inputValue
                const innerIsHeightOrderModel = editorModel ? 1 : 0
                const innerTopicId = id > 0 ? id : 1
                const data = {
                    userId: userId,
                    content: innerContent,
                    imgArray: res as string[],
                    isHeightOrderModel: innerIsHeightOrderModel,
                    topicId: innerTopicId
                }
                createCommunity(data).then(res => {
                    if (res.status === 200) {
                        showToast("发布动态成功")
                    }
                    init()
                })
            }).catch(() => {
                init()
            })
        }, 1000)
    }

    return (
        <React.Fragment>
            <div className="action-bar-pad publicFadeIn"
                 style={{width: editorModel && "100%"}}
            >
                <div className="input-action-pad">
                    {!editorModel ? <React.Fragment>
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
                        {inputValue.length === 0 && tipsVisible &&
                        <div className="text-area-tips">
                            请输入待发表内容
                        </div>}
                    </React.Fragment> : <MarkDownEditor ref={markDownRef}/>}
                </div>
                <div className="topic-action-pad">
                    <div className="left-pad">
                        <div className="topic-tips"
                             onClick={() => {
                                 setTopicVisible(true)
                             }}
                        >
                            <TopicIcon/>
                            <span>{selectTopic.title ? `已选话题:${selectTopic.title}` : "选择话题"}</span>
                        </div>
                        <TopicModal
                            visible={topicVisible}
                            setVisible={() => {
                                setTopicVisible(false)
                            }}
                            onSelected={(name, id) => {
                                setTopicVisible(false)
                                setSelectTopic({
                                    title: name,
                                    id: id
                                })
                            }}
                        />
                    </div>
                    <div className="right-pad">
                        {inputValue.length > 0 && <div className="text-number-limit">
                            {`${inputValue.length}/200`}
                        </div>}
                        <Button
                            style={{
                                width: "30%",
                                marginRight: "1rem",
                                wordBreak: "keep-all"
                            }}
                            onClick={() => {

                                setEditorModel(prevState => !prevState)
                            }}
                        >
                            高级
                        </Button>
                        <Button
                            style={{width: "50%",}}
                            onClick={() => {
                                commitCommunity()
                            }}
                        >
                            发布动态
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
                            multiple={true}
                        />
                    </div>
                    {renderImgArray(selectImgArray)}
                </div>
            </div>
            <Loading visible={loadingVisible}/>
        </React.Fragment>
    );
};

export default ActionBar;