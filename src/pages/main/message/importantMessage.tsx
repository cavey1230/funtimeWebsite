import React from 'react';

import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";
import {useHistory} from "react-router-dom";
import {
    deleteImportantMessage,
    getAllImportantMessage,
    getAllImportantMessageParams
} from "@/api/v1/message";
import MessageContainer, {Props} from "@/pages/main/message/messageContainer";
import useTimeChanger from "@/customHook/useTimeChanger";
import PublicAvatar from "@/pages/main/publicComponent/publicAvatar";
import {DeleteIcon} from "@/assets/icon/iconComponent";
import {showToast} from "@/utils/lightToast";
import useLocalStorage from "@/customHook/useLocalStorage";

import "./importantMessage.less";
import classnames from "@/utils/classnames";

const ImportantMessage = () => {

    const noReadImportantMessageDetails = useSelector((state: ReduxRootType) => {
        return state.noReadMessageReducer.noReadImportantMessageDetails
    })

    const history = useHistory()

    const timeChanger = useTimeChanger()

    const [getLocalStorage] = useLocalStorage()

    const leftConditionLabel = [{
        label: "全部消息",
        key: "all",
        id: 0
    }, {
        label: "系统消息",
        key: "system",
        id: 1
    }, {
        label: "焦点消息",
        key: "focus",
        id: 2
    }, {
        label: "推送消息",
        key: "push",
        id: 3
    }]

    const messageType = {
        focus: "焦点消息",
        system: "系统消息",
        push: "推送消息",
    }

    type KeyofMessageType = keyof typeof messageType

    const systemMessageTitleStyle = (messageType: KeyofMessageType) => {
        return messageType === "system" ? {color: "red"} : null
    }

    const renderMessageItem: Props["dataList"] = (data, userId, flushData) => {
        if (!data || data.length === 0) {
            return <div>
                消息为空
            </div>
        }
        return data?.map((item, index) => {
            const {
                id, avatar, content, createTime,
                fromUserId, importantMessageDeleteId,
                importantMessageReadId, importantMessageType,
                navigateAddress, nickname, toUserId
            } = item
            return <div
                key={id}
                className={classnames("important-message-item", {
                    "important-message-item-selected": importantMessageReadId > 0
                })}
            >
                <div className="important-message-item-title">
                    <span>{importantMessageReadId > 0 ? "已读" : "未读"}</span>
                    <span>{timeChanger(createTime)}</span>
                    <span style={systemMessageTitleStyle(importantMessageType)}>
                        {messageType[importantMessageType as KeyofMessageType]}
                    </span>
                </div>
                <div className="important-message-item-avatar-group">
                    {(importantMessageType === "push" || importantMessageType === "focus") &&
                    fromUserId && <PublicAvatar
                        avatarAddress={avatar}
                        labelString={nickname}
                        justifyContent={"flex-start"}
                        alignItem={"center"}
                        mobileImgStyle={{width: "3rem"}}
                        pcImgStyle={{width: "5rem"}}
                        mobileLabelStyle={{fontSize: "1.4rem", fontWeight: "600"}}
                        pcLabelStyle={{fontSize: "1.4rem", fontWeight: "600"}}
                        expandModel={true}
                        targetUserId={fromUserId}
                        fillHeight={true}
                    />}
                </div>
                <div className="important-message-item-content">
                    <span>{content}</span>
                    {navigateAddress && <div className="navigateTo" onClick={() => {
                        history.push(navigateAddress)
                    }}>
                        去看看吧
                    </div>}
                </div>
                <div className="action-group">
                    <div>
                        <DeleteIcon/>
                        <span onClick={() => {
                            deleteImportantMessage({
                                importantMessageId: id,
                                toUserId: getLocalStorage("userId")
                            }).then(res => {
                                if (res.status === 200) {
                                    showToast("删除成功")
                                    flushData(userId, true)
                                }
                            })
                        }}>删除</span>
                    </div>
                </div>
            </div>
        })
    }

    return (
        <MessageContainer
            initializePageNum={1}
            initializePageSize={8}
            leftConditionLabel={leftConditionLabel}
            totalDetails={noReadImportantMessageDetails}
            getData={(
                userId, pageSize, pageNum,
                condition, setMessageTotal, setMessageArray,
                messageArray, reload, setLoadingVisible
            ) => {
                const data: getAllImportantMessageParams = {
                    toUserId: userId,
                    pageSize, pageNum,
                    messageType: condition
                }
                getAllImportantMessage(data).then(res => {
                    if (res.status === 200) {
                        if (res.data.data) {
                            reload ? setMessageArray(res.data.data) :
                                setMessageArray([...messageArray, ...res.data.data])
                        } else {
                            setMessageArray([])
                        }
                        setMessageTotal(res.data.total)
                    }
                    setLoadingVisible(false)
                })
            }}
            dataList={renderMessageItem}
        />
    );
};

export default ImportantMessage;