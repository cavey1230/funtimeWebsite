import React from 'react';

import {battleImgAddress, roleImgAddress} from "@/assets/img/returnImgByNam";
import {
    SunIcon,
    MoonIcon,
    WatchIcon,
    SolidCollectIcon,
    HollowCollectIcon
} from '@/assets/icon/iconComponent';
import MoreDropdown from "@/pages/main/publicComponent/moreDropdown";
import useTimeChanger from "@/customHook/useTimeChanger";
import useMessage from '@/customHook/useMessage';
import useLocalStorage from "@/customHook/useLocalStorage";
import {createIntroductionLike} from "@/api/v1/introduction";
import {showToast} from "@/utils/lightToast";
import {useHistory} from "react-router-dom";

import "./introductionList.less";

interface Props {
    dataList: Array<any>
    nameList: { [key: string]: Array<any> }
    setDataList: (array: Array<any>) => void
}

type addIntroductionProps = (
    loginUserId: number,
    introductionId: number,
    callback: () => void
) => void

export const addIntroductionLike: addIntroductionProps = (
    loginUserId, introductionId, callback
) => {
    createIntroductionLike({
        userId: loginUserId,
        introductionId: introductionId
    }).then(res => {
        if (res.status === 200) {
            showToast("好耶")
            callback()
        }
    })
}

export const getNameById = (list: any[], id: number) => {
    const resultArray = list.length > 0 && list.filter(item => item.id === id)
    return resultArray.length > 0 ? resultArray[0].name : ""
}

export const IntroductionList: React.FC<Props> = (props) => {
    const {dataList, nameList, setDataList} = props

    const {
        server: serverList,
        area: areaList,
        role: roleList,
        race: raceList,
        career: careerList
    } = nameList

    const timeChanger = useTimeChanger()

    const sendMessage = useMessage()

    const history = useHistory()

    const [getLocalStorage] = useLocalStorage()

    const renderList = (dataList: Array<any>) => {
        let innerCount = 0
        return dataList.length === 0 ? <div>
            暂时没有数据
        </div> : dataList.map((item, index) => {
            const {
                id, gameRoleName, mainImg, race, updateTime,
                area, role, server, favoriteCareerId,
                normalOnlineTime, selfIntroduction, isSocial,
                watchNum, likeNum, hasLiked, userId
            } = item
            innerCount < 12 ? innerCount += 1 : innerCount = 0
            return <div
                key={id}
                style={{animationDelay: `${innerCount * 0.1}s`}}
                className="introduction-list-item publicFadeIn-500ms"
            >
                <div className="introduction-list-main-img"
                     onClick={() => {
                         history.push(`/main/introduction/details/${userId}`)
                     }}
                >
                    <img src={mainImg} alt="mainImg"/>
                </div>
                <div className="introduction-list-info">
                    <span>{gameRoleName}</span>
                    <div>
                        <span>{normalOnlineTime === "白天" ? <SunIcon/> : <MoonIcon/>}</span>
                        <span>{getNameById(serverList, server)} - {getNameById(areaList, area)}</span>
                        <span>{getNameById(raceList, race)}</span>
                    </div>
                    <span>{selfIntroduction}</span>
                    <div className="more-action">
                        {"更新于" + timeChanger(updateTime)}
                        <MoreDropdown
                            targetId={id}
                            bannedContentType={"introduction"}
                            dropdownPosition={"bottomRight"}
                        />
                    </div>
                </div>
                <div className="introduction-list-subscript top-right">
                    <img src={roleImgAddress(getNameById(roleList, role))} alt="roleIcon"/>
                </div>
                <div className="introduction-list-subscript top-right2">
                    <img src={battleImgAddress(getNameById(careerList, favoriteCareerId))} alt="careerIcon"/>
                </div>
                {isSocial === 1 && <div className="introduction-list-subscript transformRotate">
                    招募好友中
                </div>}
                <div className="introduction-list-subscript action-pad">
                    <div className="look-num">
                        <WatchIcon/>
                        <span>{watchNum}</span>
                    </div>
                    <div className="like-num" onClick={() => {
                        const loginUserId = getLocalStorage("userId")
                        !hasLiked && userId && addIntroductionLike(loginUserId, id, () => {
                            const copyDataArray = dataList
                            const dataItem = dataList[index]
                            const {likeNum} = dataItem
                            copyDataArray.splice(index, 1,
                                {...dataItem, hasLiked: 1, likeNum: likeNum + 1})
                            setDataList([...copyDataArray])
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
            </div>
        })
    }

    return (
        <div>
            <div className="introduction-list-container">
                {renderList(dataList)}
            </div>
        </div>
    )
}