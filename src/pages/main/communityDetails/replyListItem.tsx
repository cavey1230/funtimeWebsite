import React, {useEffect, useState} from 'react';
import {CommentActionBar} from "@/pages/main/communityDetails/commentActionBar";
import {createReply} from "@/api/v1/community";
import {showToast} from "@/utils/lightToast";
import ImgModal from "@/pages/main/publicComponent/imgModal";
import useMessage from "@/customHook/useMessage";
import useTimeChanger from "@/customHook/useTimeChanger";
import PublicAvatar from "@/pages/main/publicComponent/publicAvatar";
import MoreDropdown from "@/pages/main/publicComponent/moreDropdown";

import {MessageIcon} from "@/assets/icon/iconComponent";

import "./replyListItem.less";

interface Props {
    item: any
    index: number
    actionBarVisible: {
        selectIndex: number
        visible: boolean
    }
    setActionBarVisible: (data: Props["actionBarVisible"]) => void
    topicId: number
    flushData: () => void
    selectReplyId: number
    key: number
}

const ReplyListItem: React.FC<Props> = (props) => {

    const {
        item, index, actionBarVisible,
        setActionBarVisible, topicId,
        flushData, selectReplyId
    } = props

    const [imgVisible, setImgVisible] = useState(false)

    const timeChanger = useTimeChanger()

    useEffect(() => {
        if (Number(selectReplyId) > 0 && Number(selectReplyId) === item.id) {
            controlVisible()
        }
    }, [selectReplyId])

    const controlVisible = () => {
        const isVisible = !(actionBarVisible.selectIndex === index && actionBarVisible.visible)
        setActionBarVisible({
            selectIndex: index,
            visible: isVisible
        })
    }

    const {
        id, createTime, content, communityId, replierId,
        referId, replyToCommentId, imgArray, replyNickname, replyUserId,
        replyUserAvatar, referNickname, referUserId, referUserAvatar
    } = item

    const sendMessage = useMessage()

    return <div
        className="reply-container-item"
        style={{
            animationDelay: `${index * 0.2}s`
        }}
    >
        <div className="info-pad">
            <div className="user-pad">
                <PublicAvatar
                    avatarAddress={replyUserAvatar}
                    labelString={replyNickname}
                    justifyContent={"flex-start"}
                    alignItem={"flex-end"}
                    mobileImgStyle={{width:"3rem"}}
                    pcImgStyle={{width:"3.5rem"}}
                    mobileLabelStyle={{fontSize:"1.4rem",fontWeight:"400"}}
                    pcLabelStyle={{fontSize:"1.6rem",fontWeight:"600"}}
                    expandModel={true}
                    targetUserId={replyUserId}
                />
                {referUserId && <div className="fill-string">回复</div>}
                {referUserId && <PublicAvatar
                    avatarAddress={referUserAvatar}
                    labelString={referNickname}
                    justifyContent={"flex-start"}
                    alignItem={"flex-end"}
                    mobileImgStyle={{width:"3rem"}}
                    pcImgStyle={{width:"3.5rem"}}
                    mobileLabelStyle={{fontSize:"1.4rem",fontWeight:"400"}}
                    pcLabelStyle={{fontSize:"1.6rem",fontWeight:"600"}}
                    expandModel={true}
                    targetUserId={referUserId}
                />}
            </div>
            <div className="reply-more-action-pad">
                <MoreDropdown
                    targetId={id}
                    bannedContentType={"reply"}
                    dropdownPosition={"bottomRight"}
                />
            </div>
        </div>
        <div className="reply-content-pad">
            <div className="reply-content-group">
                <div className="time-pad">
                    {timeChanger(createTime)}
                </div>
                <div className="content">
                    {content}
                    {imgArray?.length > 0 && <div className="reply-img">
                        <img onClick={() => {
                            setImgVisible(true)
                        }} src={imgArray} alt="imgArray"/>
                    </div>}
                </div>
                <div className="reply-action-group">
                    <div onClick={() => {
                        controlVisible()
                    }}>
                        <MessageIcon/>
                        <span>回复</span>
                    </div>
                </div>
            </div>
        </div>
        {actionBarVisible.visible &&
        actionBarVisible.selectIndex === index &&
        <CommentActionBar
            flushDataFunc={() => {
                flushData()
            }}
            replyId={replyUserId}
            communityId={communityId}
            commentId={replyToCommentId}
            // 发表回复完成事件
            onFinish={(
                communityId, userId,
                inputValue, init, argumentParams
            ) => {
                const {url, commentId, replyId} = argumentParams
                const innerObj = {
                    content: inputValue,
                    communityId: Number(communityId),
                    replierId: Number(userId),
                    referId: replyId && Number(replyId),
                    replyToCommentId: Number(commentId),
                    imgArray: url ? [url] : null
                }
                createReply(innerObj).then(res => {
                    if (res.status === 200) {
                        showToast("发表评论成功")
                        sendMessage({
                            messageType: "replyToReply",
                            topicId: topicId,
                            toUserId: Number(replyId),
                            replyId: Number(id),
                            commentId: Number(commentId),
                            communityId: Number(communityId),
                            targetId: res.data.id
                        })
                    }
                    init()
                })
            }}
        />}
        {imgArray?.length > 0 && <ImgModal
            visible={imgVisible}
            setVisible={() => {
                setImgVisible(false)
            }}
            imgArray={imgArray}
            initializeImgIndex={0}
        />}
    </div>
};

export default ReplyListItem;