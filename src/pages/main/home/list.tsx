import React from 'react';
import {useHistory} from "react-router-dom";
import useTimeChanger from "@/customHook/useTimeChanger";
import {getMarkDownContent} from '@/utils/stringMatchingTool';

import "./list.less";
import {getNameById} from '../introduction/introductionList';
import {getCareerImg} from "@/pages/main/introductionDetails/categoryCareer";
import {roleImgAddress} from '@/assets/img/returnImgByName';

interface Props {
    list: Array<any>
    model: "community" | "introduction" | "notice"
    serverList?: Array<any>
    areaList?: Array<any>
    roleList?: Array<any>
    careerList?: Array<any>
}

const List: React.FC<Props> = (props) => {
    const {
        list, model, serverList, areaList,
        roleList, careerList
    } = props

    const history = useHistory()

    const timeChanger = useTimeChanger()

    const renderNoticeList = (arr: Array<any>) => {
        return arr?.map(((item, index) => {
            const {mainImg, address, mainTitle, subTitle, createTime} = item
            return <div
                className="list-item"
                key={index}
                onClick={() => {
                    history.push(address)
                }}
            >
                <div className="img-container">
                    <img src={mainImg} alt="mainImg"/>
                </div>
                <div className="list-curtain"/>
                <div className="list-item-label">
                    <div>
                        {mainTitle}
                    </div>
                    <div>
                        {subTitle}
                    </div>
                    <div>
                        {timeChanger(createTime)}
                    </div>
                </div>
            </div>
        }))
    }

    const renderCommunityList = (arr: Array<any>) => {
        return arr?.map(((item, index) => {
            const {id, createTime, imgArray, content, isHeightOrderModel} = item
            return <div
                className="list-item"
                key={index}
                onClick={() => {
                    history.push(`/main/details/${id}`)
                }}
            >
                {imgArray.length > 0 && <div className="img-container">
                    <img src={imgArray[0]} alt="mainImg"/>
                </div>}
                <div className="list-curtain"/>
                <div className="list-item-label">
                    <div>
                        {isHeightOrderModel === 1 ?
                            getMarkDownContent(content) : content}
                    </div>
                    <div>
                        {timeChanger(createTime)}
                    </div>
                </div>
            </div>
        }))
    }

    const renderIntroductionList = (arr: Array<any>) => {
        return arr?.map(((item) => {
            const {
                id, userId, selfIntroduction,
                server, area, role, favoriteCareerId, mainImg,
                gameRoleName,
            } = item
            return <div
                className="list-item"
                key={id}
                onClick={() => {
                    history.push(`/main/introduction/details/${userId}`)
                }}
            >
                <div className="img-container">
                    <img src={mainImg} alt="mainImg"/>
                </div>
                <div className="list-curtain"/>
                <div className="list-item-introduction-label">
                    <div>
                        {gameRoleName}
                    </div>
                    <div>
                        {selfIntroduction}
                    </div>
                    <div>
                        <span><img src={getCareerImg(getNameById(careerList, favoriteCareerId))} alt="career"/></span>
                        <span><img src={roleImgAddress(getNameById(roleList, role))} alt="career"/></span>
                        <span>{getNameById(serverList, server)}</span>
                        <span>{getNameById(areaList, area)}</span>
                    </div>
                </div>
            </div>
        }))
    }

    return (
        <div className="home-list-group">
            {model === "notice" && renderNoticeList(list)}
            {model === "community" && renderCommunityList(list)}
            {model === "introduction" && renderIntroductionList(list)}
        </div>
    );
}

export default List;