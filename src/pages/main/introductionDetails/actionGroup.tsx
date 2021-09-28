import React from 'react';
import {HollowCollectIcon, SolidCollectIcon, WatchIcon} from "@/assets/icon/iconComponent";
import {addIntroductionLike, getNameById} from "@/pages/main/introduction/introductionList";
import Button from "@/basicComponent/Button";
import useLocalStorage from "@/customHook/useLocalStorage";
import useMessage from "@/customHook/useMessage";

import "./actionGroup.less";
import {createSocialLog} from "@/api/v1/introduction";
import {showToast} from "@/utils/lightToast";
import useWaitTime from "@/customHook/useWaitTime";

interface Props {
    setData: (data: Props["data"]) => void
    data: { [key: string]: any }
    roleList: Array<any>
}

const ActionGroup: React.FC<Props> = (props) => {
    const {
        setData, roleList, data
    } = props

    const {
        watchNum, hasLiked, userId,
        id, likeNum, role, isSocial
    } = data

    const [getLocalStorage] = useLocalStorage()

    const sendMessage = useMessage()

    const [waitTime, setWaitTime] = useWaitTime("socialWaitTime")

    const buttonStyle = {
        marginBottom: "1rem",
        backgroundColor: "var(--bg-color)",
        color: "var(--font-color)"
    }

    const clickHandle = (param: "together" | "relationship") => {
        const loginUserId = getLocalStorage("userId")
        setWaitTime(120)
        createSocialLog({
            fromId: loginUserId,
            targetId: userId,
            requestType: param
        }).then(res => {
            if (res.status === 200) {
                showToast("已通知", "success")
            }
        })
    }

    return <div className="Introduction-details-action-group">
        <div className="action-group">
            <div className="look-num">
                <WatchIcon/>
                <span>{watchNum}</span>
            </div>
            <div className="like-num" onClick={() => {
                const loginUserId = getLocalStorage("userId")
                !hasLiked && userId && addIntroductionLike(loginUserId, id, () => {
                    setData({...data, hasLiked: 1, likeNum: data.likeNum + 1})
                    sendMessage({
                        messageType: "introduction_like",
                        toUserId: userId
                    })
                })
            }}>
                {hasLiked > 0 ? <SolidCollectIcon/> : <HollowCollectIcon/>}
                <span>{likeNum}</span>
            </div>
        </div>
        {isSocial === 1 && <div>
            <Button
                style={buttonStyle}
                onClick={() => {
                    waitTime === 0 && clickHandle("together")
                }}
            >
                想和他一起玩
                {waitTime > 0 && `(${waitTime}后可发送)`}
            </Button>
            <Button
                style={buttonStyle}
                onClick={() => {
                    waitTime === 0 && clickHandle("relationship")
                }}
            >
                捡了这只
                {getNameById(roleList, role)}
                {waitTime > 0 && `(${waitTime}后可发送)`}
            </Button>
        </div>}
    </div>
};

export default ActionGroup;