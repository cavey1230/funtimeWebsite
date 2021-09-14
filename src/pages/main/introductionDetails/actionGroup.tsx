import React from 'react';
import {HollowCollectIcon, SolidCollectIcon, WatchIcon} from "@/assets/icon/iconComponent";
import {addIntroductionLike, getNameById} from "@/pages/main/introduction/introductionList";
import Button from "@/basicComponent/Button";
import useLocalStorage from "@/customHook/useLocalStorage";
import useMessage from "@/customHook/useMessage";

import "./actionGroup.less";

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
        watchNum, hasLiked, userId, id, likeNum, role
    } = data

    const [getLocalStorage] = useLocalStorage()

    const sendMessage = useMessage()

    const buttonStyle = {
        marginBottom: "1rem",
        backgroundColor: "var(--bg-color)",
        color: "var(--font-color)"
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
        <div>
            <Button style={buttonStyle}>
                想和他一起玩
            </Button>
            <Button style={buttonStyle}>
                捡了这只{getNameById(roleList, role)}
            </Button>
        </div>
    </div>
};

export default ActionGroup;