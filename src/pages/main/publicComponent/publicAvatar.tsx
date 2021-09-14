import React, {CSSProperties, useEffect, useRef, useState} from 'react';
import Avatar from "@/basicComponent/Avatar";
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";
import FansAndFocus from "@/pages/main/publicComponent/fansAndFocus";
import {getUserLevelInfo} from "@/api/v1/user";

import "./publicAvatar.less";
import {hasFocus} from "@/api/v1/fansAndFocus";
import useLocalStorage from "@/customHook/useLocalStorage";
import FocusButton from "@/pages/main/publicComponent/focusButton";

type PropsObject = { [key: string]: string | number }

interface Props {
    avatarAddress: string
    labelString: string
    justifyContent: string
    alignItem: string
    targetUserId: string | number
    flexMod: CSSProperties["flexDirection"]
    expandModel: boolean
    mobileImgStyle: PropsObject
    mobileLabelStyle: PropsObject
    pcImgStyle: PropsObject
    pcLabelStyle: PropsObject
}

interface InnerLevelProps {
    userId: string | number
}

const InnerCom: React.FC<InnerLevelProps> = (props) => {
    const {userId} = props

    const [userLevelInfo, setUserLevelInfo] = useState({
        level: 0,
        epithet: "",
        residentEpithet: ""
    })

    const [focusStatus, setFocusStatus] = useState(0)

    const [getLocalStorage] = useLocalStorage()

    const loginUserId = getLocalStorage("userId")

    const innerComRef = useRef(null)

    useEffect(() => {
        getHasFocusStatus(loginUserId)
        getUserLevelInfo({userId: Number(userId)}).then(res => {
            if (res.status === 200) {
                const {level, residentEpithet, epithet} = res.result
                innerComRef.current && setUserLevelInfo({
                    level, residentEpithet, epithet
                })
            }
        })
    }, [])

    const getHasFocusStatus = (loginUserId: number) => {
        loginUserId && hasFocus({
            followUserId: loginUserId,
            targetUserId: Number(userId)
        }).then(res => {
            res.status === 200 && innerComRef.current && setFocusStatus(res.result)
        })
    }

    const {level, epithet, residentEpithet} = userLevelInfo

    return <div className="public-avatar-inner-com-container" ref={innerComRef}>
        <FocusButton
            communityUserId={Number(userId)}
            hasFocus={focusStatus}
            flushData={(loginUserId) => {
                getHasFocusStatus(loginUserId)
            }}
        />
        <div className="public-avatar-level-container">
            <div>等级 <span style={{fontWeight: 600, fontSize: "1.4rem"}}>{level}</span></div>
            <div>/</div>
            <div>{residentEpithet ? residentEpithet : epithet}</div>
        </div>
    </div>
}

const PublicAvatar: React.FC<Partial<Props>> = (props) => {
    const {
        avatarAddress, labelString,
        mobileImgStyle, mobileLabelStyle,
        pcImgStyle, pcLabelStyle, justifyContent,
        alignItem, targetUserId, expandModel, flexMod
    } = props

    const isMobile = useSelector((state: ReduxRootType) => {
        return state.windowResizeReducer.isMobile
    })

    return (
        <Avatar
            avatarAddress={avatarAddress}
            width={"initial"}
            labelString={labelString}
            expandModel={expandModel ? !isMobile : false}
            imgStyle={isMobile ? mobileImgStyle : pcImgStyle}
            labelStyle={isMobile ? mobileLabelStyle : pcLabelStyle}
            justifyContent={justifyContent}
            alignItem={alignItem}
            navigateAddress={`/404${targetUserId}`}
            dropdownPosition={"bottomLeft"}
            flexModel={flexMod}
        >
            <div className="public-avatar-expand-container">
                <InnerCom userId={targetUserId}/>
                <FansAndFocus userId={targetUserId}/>
            </div>
        </Avatar>
    );
};

export default PublicAvatar;