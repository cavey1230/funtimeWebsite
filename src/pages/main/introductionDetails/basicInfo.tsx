import React from 'react';
import {roleImgAddress} from "@/assets/img/returnImgByName";
import {getNameById} from "@/pages/main/introduction/introductionList";
import PublicAvatar from "@/pages/main/publicComponent/publicAvatar";
import {getCareerImg} from "@/pages/main/introductionDetails/categoryCareer";
import {weekDescriberChange} from "@/pages/main/introduction/searchPad";
import useTimeChanger from "@/customHook/useTimeChanger";

import "./basicInfo.less";
import MoreDropdown from "@/pages/main/publicComponent/moreDropdown";

interface Props {
    roleList: Array<any>
    serverList: Array<any>
    areaList: Array<any>
    raceList: Array<any>
    careerList: Array<any>
    data: { [key: string]: any }
}

const BasicInfo: React.FC<Props> = (props) => {
    const {
        data, roleList, serverList,
        areaList, raceList, careerList
    } = props

    const {
        role, gameRoleName, introductionAvatar, id,
        introductionNickname, userId, normalOnlineTime,
        server, area, race, updateTime, favoriteCareerId,
        preciseOnlineTime, sns, isSocial, selfIntroduction,
        mainImg
    } = data

    const timeChanger = useTimeChanger()

    return <div className="basic-info-item">
        <div className="user-details-group">
            <div className="game-role-name">
                <img src={roleImgAddress(getNameById(roleList, role))} alt="roleIcon"/>
                <span>{gameRoleName}</span>
                <PublicAvatar
                    avatarAddress={introductionAvatar}
                    labelString={introductionNickname}
                    justifyContent={"flex-start"}
                    alignItem={"center"}
                    mobileImgStyle={{width: "2rem"}}
                    pcImgStyle={{width: "3rem"}}
                    mobileLabelStyle={{fontSize: "1.4rem", fontWeight: "400"}}
                    pcLabelStyle={{fontSize: "1.6rem", fontWeight: "600"}}
                    expandModel={true}
                    targetUserId={userId}
                />
            </div>
            <MoreDropdown
                data={{
                    id, userId,
                    nickname: "" + getNameById(serverList, server) + "-" +
                        getNameById(areaList, area) + "-" + gameRoleName,
                    content: selfIntroduction,
                    imgArray: mainImg,
                }}
                targetId={id}
                contentType={"introduction"}
                dropdownPosition={"bottomRight"}
            />
        </div>
        <div className="info-item-group">
            <div><span>在线时间:</span>{normalOnlineTime}</div>
            <div>{getNameById(serverList, server)} - {getNameById(areaList, area)}</div>
            <div><span>种族:</span>{getNameById(raceList, race)}</div>
            <div><span>个人情报更新时间:</span>{timeChanger(updateTime)}</div>
            <div>
                <span>喜爱职业:</span>
                <img src={getCareerImg(getNameById(careerList, favoriteCareerId))}
                     alt="favoriteCareer"/>
            </div>
            <div>
                <span>周在线时间:</span>
                {weekDescriberChange(
                    preciseOnlineTime ? preciseOnlineTime.map((item: number) => item - 1) : [],
                    ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"]
                )}
            </div>
            <div><span>联系方式:</span>{sns}</div>
            <div><span>状态:</span>{isSocial === 1 ? "好友招募中" : "暂时不招募好友"}</div>
        </div>
        <fieldset className="self-introduction">
            <legend style={{padding: "0 1rem"}}>个人介绍</legend>
            <span> {selfIntroduction}</span>
        </fieldset>
    </div>
};

export default BasicInfo;