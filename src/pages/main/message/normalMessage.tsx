import React, {useState} from 'react';

import {deleteMessage, getAllMessage, getAllMessageParams} from "@/api/v1/message";
import {createReply} from "@/api/v1/community";
import {showToast} from "@/utils/lightToast";
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";
import {HollowCollectIcon, MessageIcon, DeleteIcon} from "@/assets/icon/iconComponent";
import MessageContainer, {Props} from "@/pages/main/message/messageContainer";
import {useHistory} from "react-router-dom";
import {CommentActionBar} from "@/pages/main/message/commentActionBar";
import useMessage from "@/customHook/useMessage";
import PublicAvatar from "@/pages/main/publicComponent/publicAvatar";
import useTimeChanger from '@/customHook/useTimeChanger';
import {getMarkDownContent} from '@/utils/stringMatchingTool';

import "./normalMessage.less";

const NormalMessage: React.FC = () => {

    const noReadNormalMessageDetails = useSelector((state: ReduxRootType) => {
        return state.noReadMessageReducer.noReadNormalMessageDetails
    })

    const [actionVisible, setActionVisible] = useState({
        selectIndex: -1,
        visible: false
    })

    const history = useHistory()

    const sendMessage = useMessage()

    const timeChanger = useTimeChanger()

    const leftConditionLabel = [{
        label: "全部消息",
        key: "all",
        id: 0
    }, {
        label: "动态被喜欢",
        key: "like",
        id: 1
    }, {
        label: "个人情报被喜欢",
        key: "introduction_like",
        id: 2
    }, {
        label: "被评论",
        key: "comment",
        id: 3
    }, {
        label: "被回复",
        key: "reply",
        id: 4
    }, {
        label: "被再次回复",
        key: "replyToReply",
        id: 5
    }]

    const navigateTo = (options: {
        messageType?: string
        communityId?: number
        commentId?: number
        targetId?: number
    }) => {
        const {commentId, targetId, communityId, messageType} = options
        if (messageType === "like" || !messageType) {
            history.push(`/main/details/${communityId}`)
        }
        if (messageType === "comment") {
            history.push(`/main/details/${communityId}/${commentId}/0`)
        }
        if (messageType === "reply" || messageType === "replyToReply") {
            history.push(`/main/details/${communityId}/${commentId}/${targetId}`)
        }
    }

    const renderMessageItem: Props["dataList"] = (
        data, userId, flushData
    ) => {
        if (!data || data.length === 0) {
            return <div>
                消息为空
            </div>
        }
        return data?.map((item, index) => {
            const {
                id, createTime, communityId,
                replyId, commentId, messageType,
                fromUserId, content, communityContent,
                commentContent, replyContent, nickname,
                avatar, statusWord, haveRead, targetId,
                topicId, replierId
            } = item
            return <div
                key={id}
                className="normal-message-item"
            >
                <div className="time">
                    <span>{haveRead === 1 ? "已读" : "未读"}</span>
                    <span>{timeChanger(createTime)}</span>
                    <span>{messageType === "like" ? <HollowCollectIcon/> : <MessageIcon/>}</span>
                </div>
                <div className="info-group">
                    <div className="avatar-group">
                        <div className="avatar">
                            <PublicAvatar
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
                            />
                            <div className="normal-message-type">
                                <span>{statusWord}</span>
                            </div>
                        </div>
                    </div>
                    <div className="info-content-group">
                        {messageType !== "introduction_like" &&
                        <div className="community-content">
                            在动态内容为
                            <span onClick={() => {
                                navigateTo({
                                    communityId
                                })
                            }}>
                                {getMarkDownContent(communityContent)}
                            </span>
                        </div>}

                        {messageType === "replyToReply" &&
                        <div className="reply-content">
                            在回复内容为
                            <span
                                onClick={() => {
                                    navigateTo({
                                        messageType: "reply",
                                        communityId,
                                        commentId,
                                        targetId: replyId
                                    })
                                }}
                            >
                                {replyContent}
                            </span>
                        </div>}

                        {messageType === "reply" &&
                        <div className="comment-content">
                            在评论内容为
                            <span
                                onClick={() => {
                                    navigateTo({
                                        messageType: "comment",
                                        communityId,
                                        commentId
                                    })
                                }}
                            >
                                {commentContent}
                            </span>
                        </div>}

                    </div>
                </div>

                {(messageType !== "like" &&
                    messageType !== "introduction_like"
                ) && <div
                    className="content-group"
                    onClick={() => {
                        navigateTo({
                            messageType,
                            communityId,
                            commentId,
                            targetId
                        })
                    }}
                >
                    <div>中说到:</div>
                    <div>{content}</div>
                </div>}

                <div className="action-group">
                    {(messageType !== "like" &&
                        messageType !== "introduction_like")
                    && <div>
                        <MessageIcon/>
                        <span onClick={() => {
                            setActionVisible({
                                selectIndex: index,
                                visible: !(actionVisible.selectIndex === index && actionVisible.visible)
                            })
                        }}>快速回复</span>
                    </div>}
                    <div>
                        <DeleteIcon/>
                        <span onClick={() => {
                            deleteMessage(id).then(res => {
                                if (res.status === 200) {
                                    showToast("删除成功")
                                    flushData(userId, true)
                                }
                            })
                        }}>删除</span>
                    </div>
                </div>
                {actionVisible.visible &&
                actionVisible.selectIndex === index &&
                <CommentActionBar
                    flushDataFunc={() => {
                        //这里暂时不做处理
                    }}
                    communityId={communityId}
                    commentId={commentId}
                    replyId={messageType === "comment" ? 0 : replyId}
                    onFinish={(
                        communityId, userId,
                        inputValue, init, argumentParams
                    ) => {
                        const {url, commentId, replyId} = argumentParams
                        const innerObj = {
                            content: inputValue,
                            communityId: Number(communityId),
                            replierId: Number(userId),
                            referId: fromUserId,
                            replyToCommentId: Number(commentId),
                            imgArray: url ? [url] : null
                        }
                        createReply(innerObj).then(res => {
                            if (res.status === 200) {
                                showToast("发表评论成功")
                                sendMessage({
                                    messageType: messageType === "comment" ? "reply" : "replyToReply",
                                    topicId: topicId,
                                    fromUserId: Number(userId),
                                    toUserId: fromUserId,
                                    commentId: Number(commentId),
                                    communityId: Number(communityId),
                                    replyId: messageType !== "comment" ? Number(targetId) : Number(res.data.id),
                                    targetId: Number(res.data.id)
                                })
                            }
                            init()
                        })
                    }}
                />}
            </div>
        })
    }

    return (
        <MessageContainer
            initializePageNum={1}
            initializePageSize={8}
            leftConditionLabel={leftConditionLabel}
            totalDetails={noReadNormalMessageDetails}
            getData={(
                userId, pageSize, pageNum,
                condition, setMessageTotal, setMessageArray,
                messageArray, reload
            ) => {
                const data: getAllMessageParams = {
                    toUserId: userId,
                    pageSize, pageNum
                }
                if (condition !== "all") {
                    data.messageType = condition
                }
                getAllMessage(data).then(res => {
                    if (res.status === 200) {
                        if (res.data.data) {
                            reload ? setMessageArray(res.data.data) :
                                setMessageArray([...messageArray, ...res.data.data])
                        } else {
                            setMessageArray([])
                        }
                        setMessageTotal(res.data.total)
                    }
                })
            }}
            dataList={renderMessageItem}
        />
    );
}

export default NormalMessage;