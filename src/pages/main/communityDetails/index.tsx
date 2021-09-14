import React, {useEffect, useRef, useState} from 'react';

import {createComment, createCommunityWatch, getOneCommunity} from "@/api/v1/community";
import {useHistory, useRouteMatch} from "react-router-dom";
import {addCommunityLike} from "@/pages/main/community/communityItem";
import ImgModal from "@/pages/main/publicComponent/imgModal";
import {CommentActionBar, Props as ActionBarProps} from "@/pages/main/communityDetails/commentActionBar";
import CommentContainer from "@/pages/main/communityDetails/commentContainer";
import {showToast} from "@/utils/lightToast";
import useLocalStorage from "@/customHook/useLocalStorage";
import useMessage from "@/customHook/useMessage";
import FocusButton from "@/pages/main/publicComponent/focusButton";

import {HollowCollectIcon, SolidCollectIcon, WatchIcon} from "@/assets/icon/iconComponent";

import "./index.less";
import useTimeChanger from '@/customHook/useTimeChanger';
import PublicAvatar from "@/pages/main/publicComponent/publicAvatar";
import {mdParser} from "@/utils/mdParser";
import MoreDropdown from "@/pages/main/publicComponent/moreDropdown";

type onFinish = ActionBarProps["onFinish"]

const Index = () => {
    const [communityData, setCommunityData] = useState({
        avatar: "",
        content: "",
        createTime: "",
        email: "",
        id: 0,
        imgArray: [],
        likeNum: 0,
        lookNum: 0,
        nickname: "",
        password: "",
        role: 0,
        topicId: 0,
        userId: 0,
        username: "",
        verificationStatus: 0,
        whereToLearn: "",
        hasLiked: 0,
        hasFocus: 0,
        hasWatch: 0,
        isHeightOrderModel: 0
    })

    const [visible, setVisible] = useState(false)

    const [selectImgIndex, setSelectImgIndex] = useState(0)

    const match = useRouteMatch()

    const commentListRef = useRef(null)

    const {communityId, commentId, replyId} = (match.params as any)

    const [getLocalStorage] = useLocalStorage()

    const history = useHistory()

    const sendMessage = useMessage()

    const timeChanger = useTimeChanger()

    const {
        avatar, content, nickname, userId,
        createTime, imgArray, lookNum,
        likeNum, hasLiked, id, topicId, hasFocus,
        isHeightOrderModel, hasWatch
    } = communityData

    useEffect(() => {
        const scroll = document.body
        scroll.scrollTo({
            top: 0
        })
        const loginUserId = Number(getLocalStorage("userId")) || 0
        getData(communityId, loginUserId)
    }, [])

    const getData = (communityId: number, userId: number) => {
        getOneCommunity({id: communityId, loginUserId: userId}).then(res => {
            if (res.status === 200 && res.data.id > 0) {
                const innerData = res.data;
                (res.data.hasWatch === 0 && userId) ? createCommunityWatch({
                    userId: userId,
                    communityId: Number(communityId)
                }).then(res2 => {
                    if (res2.status === 200) {
                        showToast("浏览量加一")
                        innerData.lookNum += 1
                        setCommunityData(innerData)
                    }
                }) : setCommunityData(innerData)
            } else {
                history.replace("/404")
            }
        })
    }

    const renderImgItem = (array: Array<any>) => {
        // const length = array?.length
        // const innerStyle = imgWidthAndHeightControl(length, {
        //     thirdRowHeight: "20rem",
        //     secondRowHeight: "30rem",
        //     firstRowHeight: "60rem"
        // })
        return array?.map(((item, index) => {
            return <img
                className="img-item"
                // style={innerStyle}
                src={item}
                key={index}
                alt={`img-item-${index}`}
                onClick={() => {
                    setSelectImgIndex(index)
                    setVisible(true)
                }}
            />
        }))
    }

    const onFinish: onFinish = (
        communityId, userId,
        inputValue, init, argumentParams
    ) => {
        const {url, commentId} = argumentParams
        const innerObj = url ? {
            content: inputValue,
            communityId: Number(communityId),
            commenterId: Number(userId),
            imgArray: [url]
        } : {
            content: inputValue,
            communityId: Number(communityId),
            commenterId: Number(userId)
        }
        createComment(innerObj).then(res => {
            if (res.status === 200) {
                showToast("发表评论成功")
                sendMessage({
                    messageType: "comment",
                    topicId: topicId,
                    toUserId: communityData.userId,
                    communityId: Number(communityId),
                    commentId: Number(res.data.id),
                    targetId: Number(res.data.id)
                })
            }
            init()
        })
    }

    return (
        <React.Fragment>
            {id > 0 && <div className="community-detail-pad publicFadeIn-500ms">
                <div className="community-detail-inner-container">
                    <div className="avatar-group">
                        <PublicAvatar
                            avatarAddress={avatar}
                            labelString={nickname}
                            justifyContent={"flex-start"}
                            alignItem={"center"}
                            mobileImgStyle={{width: "5rem"}}
                            pcImgStyle={{width: "7rem"}}
                            mobileLabelStyle={{fontSize: "1.4rem", fontWeight: "400"}}
                            pcLabelStyle={{fontSize: "2rem", fontWeight: "600"}}
                            expandModel={true}
                            targetUserId={userId}
                        />
                        <div className="avatar-button">
                            <div>
                                <MoreDropdown
                                    targetId={id}
                                    bannedContentType={"community"}
                                    dropdownPosition={"bottomRight"}
                                />
                            </div>
                            <div>
                                <FocusButton
                                    communityUserId={userId}
                                    hasFocus={hasFocus}
                                    flushData={(userId: number) => {
                                        getData(communityId, userId)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="content-group">
                        <div className="time">
                            发布日期:{timeChanger(createTime)}
                        </div>
                        {isHeightOrderModel === 1 ? <div
                            dangerouslySetInnerHTML={{
                                __html: mdParser.render(content)
                            }}
                            className="markdown-content"
                        /> : <div className="content">
                            {content}
                        </div>}
                    </div>
                    <div className="img-group">
                        {renderImgItem(imgArray)}
                    </div>
                    <div className="action-group">
                        <div className="look-num">
                            <WatchIcon/>
                            <span>{lookNum}</span>
                        </div>
                        <div className="like-num" onClick={() => {
                            const loginUserId = Number(getLocalStorage("userId"))
                            !hasLiked && addCommunityLike(loginUserId, id, topicId, userId, () => {
                                getData(communityId, loginUserId)
                                sendMessage({
                                    messageType: "like",
                                    topicId: topicId,
                                    toUserId: userId,
                                    communityId: Number(communityId)
                                })
                            })
                        }}>
                            {hasLiked ? <SolidCollectIcon/> : <HollowCollectIcon/>}
                            <span>{likeNum}</span>
                        </div>
                    </div>
                    <div className="comment-group">
                        <CommentActionBar
                            flushDataFunc={() => {
                                commentListRef.current.flushData()
                            }}
                            communityId={communityId}
                            onFinish={onFinish}
                        />
                        <CommentContainer
                            topicId={topicId}
                            ref={commentListRef}
                            communityId={communityId}
                            selectCommentId={commentId}
                            selectReplyId={replyId}
                        />
                    </div>
                </div>
            </div>}
            <ImgModal
                visible={visible}
                setVisible={() => {
                    setVisible(false)
                }}
                imgArray={imgArray}
                initializeImgIndex={selectImgIndex}
            />
        </React.Fragment>
    );
}

export default Index;