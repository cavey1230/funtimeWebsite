import React, {useRef} from 'react';
import MoreDropdown from "@/pages/main/publicComponent/moreDropdown";
import {getMarkDownContent} from "@/utils/stringMatchingTool";
import PublicAvatar from "@/pages/main/publicComponent/publicAvatar";
import {HollowCollectIcon, MessageIcon, SolidCollectIcon, WatchIcon} from "@/assets/icon/iconComponent";
import {useHistory} from "react-router-dom";
import useTimeChanger from "@/customHook/useTimeChanger";
import useLocalStorage from "@/customHook/useLocalStorage";
import useMessage from "@/customHook/useMessage";
import {createCommunityLike} from "@/api/v1/community";
import {showToast} from "@/utils/lightToast";

import "./communityItem.less";

interface Props {
    item: { [key: string]: any }
    index: number
    dataArray: Array<any>
    setData: (array: Array<any>) => void
}

interface Options {
    firstRowHeight: string
    secondRowHeight: string
    thirdRowHeight: string
}

type AddCommunityLikeParams = (
    userId: number, communityId: number,
    topicId: number, communityUserId: number,
    init: () => void
) => void

const imgWidthAndHeightControl = (length: number, option: Options) => {
    const innerStyle = {height: "0", width: "0"}
    const {firstRowHeight, secondRowHeight, thirdRowHeight} = option
    if (length === 1) {
        innerStyle.width = "100%"
        innerStyle.height = "20rem"
    } else if (length % 3 === 0) {
        innerStyle.width = "33.33%"
    } else if (length % 2 === 0) {
        innerStyle.width = "50%"
    }
    if (length > 1 && length <= 3) {
        innerStyle.height = firstRowHeight
    } else if (length > 3 && length <= 6) {
        innerStyle.height = secondRowHeight
    } else if (length > 6 && length <= 9) {
        innerStyle.height = thirdRowHeight
    }
    return innerStyle
}

export const addCommunityLike: AddCommunityLikeParams = (
    userId, communityId,
    topicId, communityUserId, init
) => {
    createCommunityLike({
        userId, communityId, topicId, communityUserId
    }).then(res => {
        if (res.status === 200) {
            showToast("好耶")
            init()
        }
    })
}

const CommunityItem: React.FC<Props> = (props) => {

    const {item, index, dataArray, setData} = props

    const history = useHistory()

    const timeChanger = useTimeChanger()

    const [getLocalStorage] = useLocalStorage()

    const sendMessage = useMessage()

    const itemRef = useRef(null)

    const renderImg = (array: Array<any>) => {
        const length = array?.length
        const innerStyle = imgWidthAndHeightControl(length, {
            firstRowHeight: "35rem",
            secondRowHeight: "20rem",
            thirdRowHeight: "15rem"
        })
        if (length > 0) {
            return array?.map((item, index) => {
                return <div
                    className="img-group-item"
                    style={innerStyle}
                    key={index}
                >
                    <img src={item} alt={`content-item-img-${index}`}/>
                </div>
            })
        } else {
            return null
        }
    }

    const urlPush = (id: number) => {
        history.push(`/main/details/${id}`)
        // window.open(`/#/main/details/${id}`)
    }

    const {
        createTime, id, userId, likeNum,
        content, imgArray, lookNum, messageNum,
        nickname, avatar, topicId, hasLiked,
        isHeightOrderModel
    } = item

    return (<div
        className="content-container-item"
        key={id}
        ref={itemRef}
    >
        <div
            className="img-group"
            onClick={() => {
                urlPush(id)
            }}
        >
            {renderImg(imgArray)}
        </div>
        <div className="time-and-more-action-container">
            {timeChanger(createTime)}
            <MoreDropdown
                targetId={id}
                bannedContentType={"community"}
                dropdownPosition={"bottomRight"}
            />
        </div>
        {content && <div
            className="content"
            onClick={() => {
                urlPush(id)
            }}
        >
            {content.length >= 50 ?
                isHeightOrderModel === 1 ?
                    getMarkDownContent(content)
                    : content + "..."
                : content}
        </div>}
        <PublicAvatar
            avatarAddress={avatar}
            labelString={nickname}
            justifyContent={"flex-start"}
            alignItem={"center"}
            mobileImgStyle={{width: "2.5rem"}}
            pcImgStyle={{width: "3.5rem"}}
            mobileLabelStyle={{fontSize: "1.2rem", fontWeight: "400"}}
            pcLabelStyle={{fontSize: "1.2rem", fontWeight: "400"}}
            expandModel={true}
            targetUserId={userId}
        />
        <div className="action-group">
            <div className="look-num">
                <WatchIcon/>
                <span>{lookNum}</span>
            </div>
            <div className="message-num">
                <MessageIcon/>
                <span>{messageNum}</span>
            </div>
            <div className="like-num" onClick={() => {
                const loginUserId = getLocalStorage("userId")
                !hasLiked && addCommunityLike(loginUserId, id, topicId, userId, () => {
                    const copyDataArray = dataArray
                    const dataItem = dataArray[index]
                    const {likeNum} = dataItem
                    copyDataArray.splice(index, 1,
                        {...dataItem, hasLiked: 1, likeNum: likeNum + 1})
                    setData([...copyDataArray])
                    sendMessage({
                        messageType: "like",
                        topicId: topicId,
                        toUserId: userId,
                        communityId: Number(id)
                    })
                })
            }}>
                {hasLiked > 0 ? <SolidCollectIcon/> : <HollowCollectIcon/>}
                <span>{likeNum}</span>
            </div>
        </div>
    </div>)
}

export default CommunityItem;