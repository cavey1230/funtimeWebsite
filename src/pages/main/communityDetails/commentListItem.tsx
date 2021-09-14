import React, {useEffect, useRef, useState} from 'react';
import {CommentActionBar, Props as ActionBarProps} from "@/pages/main/communityDetails/commentActionBar";
import ReplyContainer from "@/pages/main/communityDetails/replyContainer";
import {createReply, getReplyList, getReplyPageNum} from "@/api/v1/community";
import {showToast} from "@/utils/lightToast";
import ImgModal from "@/pages/main/publicComponent/imgModal";
import Screening from "@/basicComponent/Screening";
import useMessage from "@/customHook/useMessage";
import {ExpandIcon, NoExpandIcon, MessageIcon} from "@/assets/icon/iconComponent";

import "./commentListItem.less";
import useTimeChanger from "@/customHook/useTimeChanger";
import PublicAvatar from "@/pages/main/publicComponent/publicAvatar";
import MoreDropdown from "@/pages/main/publicComponent/moreDropdown";

interface Props {
    data: {
        id: number
        createTime: string
        content: string
        communityId: number
        imgArray: Array<any>
        commentNickname: string
        commentUserAvatar: string
        commenterId: number
        replyNum: number
    }
    index: number
    actionBarVisible: {
        selectIndex: number
        visible: boolean
    }
    topicId: number
    setActionBarVisible: (obj: Props["actionBarVisible"]) => void
    key: number
    style?: { [key: string]: string | number }
    isExpand?: boolean
    selectCommentId?: number
    selectReplyId?: number
}

type onFinish = ActionBarProps["onFinish"]

const CommentListItem: React.FC<Props> = (props) => {

    const {
        data, actionBarVisible,
        setActionBarVisible, index,
        style, topicId, isExpand,
        selectCommentId, selectReplyId
    } = props

    const [replyList, setReplyList] = useState([])

    const [replyVisible, setReplyVisible] = useState(isExpand)

    const [imgVisible, setImgVisible] = useState(false)

    const [total, setTotal] = useState(0)

    const [pagination, setPagination] = useState({
        pageNum: 1,
        pageSize: 6
    })

    const [condition, setCondition] = useState([] as Array<string>)

    const sendMessage = useMessage()

    const timeChanger = useTimeChanger()

    const {
        id, createTime, content,
        communityId, imgArray,
        commentNickname, commentUserAvatar,
        commenterId, replyNum
    } = data

    const replyListRef = useRef(null)

    useEffect(() => {
        if (Number(selectCommentId) === id) {
            if (Number(selectReplyId) === 0) {
                controlVisible()
            }
            setReplyVisible(true)
            setTimeout(() => {
                operationScrollTop()
            }, 100)
        }
    }, [selectCommentId])

    useEffect(() => {
        if (selectReplyId && selectReplyId > 0) {
            getReplyPageNum({
                id: selectReplyId,
                communityId: communityId,
                commentId: selectCommentId,
                pageSize: pagination.pageSize
            }).then(res => {
                if (res.status === 200) {
                    setPagination({
                        ...pagination,
                        pageNum: res.data
                    })
                }
            })
        }
    }, [selectReplyId])

    useEffect(() => {
        replyNum > 0 && getReplyListData()
    }, [pagination])

    const controlVisible = () => {
        setActionBarVisible({
            selectIndex: index,
            visible: !(actionBarVisible.selectIndex === index && actionBarVisible.visible)
        })
    }

    const getReplyListData = () => {
        const data = condition ? {
            communityId: communityId,
            replyToCommentId: id,
            pageSize: pagination.pageSize,
            pageNum: pagination.pageNum,
            [condition[0]]: condition[1]
        } : {
            communityId: communityId,
            replyToCommentId: id,
            pageSize: pagination.pageSize,
            pageNum: pagination.pageNum
        }
        getReplyList(data).then(res => {
            if (res.status === 200) {
                setReplyList(res.data.data)
                setTotal(res.data.total)
            }
        })
    }

    const onFinish: onFinish = (
        communityId, userId,
        inputValue, init, argumentParams
    ) => {
        const {url, commentId} = argumentParams
        const innerObj = {
            content: inputValue,
            communityId: Number(communityId),
            replierId: Number(userId),
            replyToCommentId: Number(commentId),
            imgArray: url ? [url] : null
        }
        createReply(innerObj).then(res => {
            if (res.status === 200) {
                showToast("发表评论成功")
                sendMessage({
                    messageType: "reply",
                    topicId: topicId,
                    toUserId: Number(commenterId),
                    commentId: Number(commentId),
                    communityId: Number(communityId),
                    replyId: Number(res.data.id),
                    targetId: Number(res.data.id)
                })
            }
            init()
        })
    }

    const operationScrollTop = () => {
        const scroll = document.body
        const {offsetTop, clientHeight} = replyListRef.current
        scroll.scrollTo({
            top: offsetTop + clientHeight,
            behavior: "smooth"
        })
    }

    return (
        <React.Fragment>
            <div
                className="comment-container-item"
                ref={replyListRef}
                style={style}
            >
                <div className="comment-user-group">
                    <PublicAvatar
                        flexMod={"column"}
                        avatarAddress={commentUserAvatar}
                        labelString={commentNickname}
                        justifyContent={"flex-start"}
                        alignItem={"flex-start"}
                        mobileImgStyle={{width: "3rem"}}
                        pcImgStyle={{width: "5rem"}}
                        mobileLabelStyle={{fontSize: "1.4rem", fontWeight: "400", marginLeft: "0"}}
                        pcLabelStyle={{fontSize: "1.6rem", fontWeight: "600", marginLeft: "0"}}
                        expandModel={true}
                        targetUserId={commenterId}
                    />
                    <span>{timeChanger(createTime)}</span>
                </div>
                <div className="comment-avatar-pad">
                    <div className="comment-more-action-pad">
                        <MoreDropdown
                            targetId={id}
                            bannedContentType={"comment"}
                            dropdownPosition={"bottomRight"}
                        />
                    </div>
                    <div className="comment-avatar-content-content">
                        {content}
                    </div>
                    <div className="comment-avatar-content-img">
                        {imgArray?.length > 0 && <img onClick={() => {
                            setImgVisible(true)
                        }} src={imgArray[0]} alt="imgArray"/>}
                    </div>
                    <div className="comment-action-group">
                        {total > 0 && <div onClick={() => {
                            setReplyVisible(prevState => !prevState)
                            setTimeout(() => {
                                !replyVisible && operationScrollTop()
                            }, 100)
                        }}>
                            {replyVisible ? <ExpandIcon/> : <NoExpandIcon/>}
                            <span>查看{`(${total})`}</span>
                        </div>}
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
                    getReplyListData()
                }}
                communityId={communityId}
                commentId={id}
                onFinish={onFinish}
            />}
            {replyVisible && <div className="reply-container-with-comment">
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <Screening
                        setCondition={(array) => {
                            setCondition([...array])
                            setPagination({
                                pageNum: 1,
                                pageSize: 6
                            })
                        }}
                        style={{margin: "0", width: "25%"}}
                        labelArray={[{
                            name: "时间",
                            key: "timeControl"
                        }]}
                    />
                </div>
                <ReplyContainer
                    topicId={topicId}
                    replyList={replyList}
                    total={total}
                    pagination={pagination}
                    flushData={getReplyListData}
                    setPagination={setPagination}
                    selectReplyId={selectReplyId}
                />
            </div>}
            {imgArray?.length > 0 && <ImgModal
                visible={imgVisible}
                setVisible={() => {
                    setImgVisible(false)
                }}
                imgArray={imgArray}
                initializeImgIndex={0}
            />}
        </React.Fragment>
    )
}

export default CommentListItem;