import React, {useCallback} from 'react';
import useGetNameList from "@/customHook/useGetNameList";
import {roleImgAddress} from "@/assets/img/returnImgByName";
import {getNameById} from "@/pages/main/introduction/introductionList";

import {getCareerImg, getDetailsCategoryCareer} from "@/pages/main/introductionDetails/categoryCareer";
import {weekDescriberChange} from "@/pages/main/introduction/searchPad";
import classnames from "@/utils/classnames";
import whiteLogo from "@/assets/img/logo-white.png";

import "./cardTemplate2.less";

interface Props {
    data: { [key: string]: any }
    selectImgIndex: number
    fontFamily: string
    width?: string
    height?: string
    tinyModulate?: {
        left: 0,
        top: 0
    }
}

const CardTemplate2: React.FC<Props> = (props) => {
    const {
        data, selectImgIndex, fontFamily,
        width, height, tinyModulate
    } = props

    const nameList = useGetNameList()

    const {
        server: serverList,
        area: areaList,
        race: raceList,
        role: roleList,
        career: careerList,
        property: propertyList,
    } = nameList

    const {
        careerIdArray, imgArray,
        propertyIdArray, propertyRangeArray
    } = data

    const {
        role, gameRoleName, normalOnlineTime,
        server, area, race, favoriteCareerId,
        preciseOnlineTime, sns, selfIntroduction
    } = data

    const renderCareerCategory = useCallback((careerList: Array<any>, selectedList: Array<any>) => {
        const innerSelectedList = selectedList ? selectedList : []
        return careerList && getDetailsCategoryCareer(careerList)?.map((item: any, index) => {
            return <div className="career-first-category" key={index}>
                {item.map((item2: any) => {
                    const {id, name} = item2
                    return <div
                        className={
                            classnames("career-details-item", {
                                "selected": innerSelectedList.includes(id)
                            })
                        }
                        style={{
                            display: innerSelectedList.includes(id) ? "flex" : "none"
                        }}
                        key={id}
                    >
                        <img src={getCareerImg(name)} alt={`career_icon_${id}`}/>
                    </div>
                })}
            </div>
        })
    }, [])

    const renderPropertyList = (propertyIdArray: Array<any>, propertyRangeArray: Array<any>) => {
        return propertyIdArray?.map((item, index) => {
            return <div key={index} className="property-info-item">
                <div className="label">
                    {getNameById(propertyList, item)}
                </div>
                <div className="content">
                    {(propertyRangeArray[index] > 3 && propertyRangeArray[index] < 5) ? "高" :
                        (propertyRangeArray[index] > 5) ? "极高" :
                            (propertyRangeArray[index] && propertyRangeArray[index] <= 3) && "中等"}
                </div>
            </div>
        })
    }

    return (
        <div className="card-template2-container" style={{
            fontFamily, width, height
        }}>
            <div className="top-panel">
                <div className="name-and-logo common">
                    <div>
                        <div className="game-role-name">
                            <img src={getCareerImg(getNameById(careerList, favoriteCareerId))}
                                 alt="favoriteCareer"/>
                            <img src={roleImgAddress(getNameById(roleList, role))} alt="roleIcon"/>
                            <div>{gameRoleName}</div>
                        </div>
                        <div className="server-and-race">
                            <div>
                                {getNameById(serverList, server)} - {getNameById(areaList, area)}
                            </div>
                            <div>
                                <span>种族:</span>
                                <span>{getNameById(raceList, race)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="logo">
                        <img src={whiteLogo} alt="logo"/>
                    </div>
                </div>
            </div>
            <div className="bottom-panel">
                <div className="self-introduction">
                    <span>{selfIntroduction}</span>
                </div>
                <div className="career-info-container">
                    <div className="career-info-item">
                        {renderCareerCategory(careerList, careerIdArray)}
                    </div>
                </div>
                <div className="info-item-group web-font">
                    <div>
                        <span>在线时间:</span>
                        <span>{normalOnlineTime}</span>
                    </div>
                    <div>
                        <span>周在线时间:</span>
                        <span>{weekDescriberChange(
                            preciseOnlineTime ? preciseOnlineTime.map((item: number) => item - 1) : [],
                            ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"]
                        )}</span>
                    </div>
                    <div>
                        <span>联系方式:</span>
                        <span>{sns}</span>
                    </div>
                </div>
                <div className="template-property-info-group">
                    {renderPropertyList(propertyIdArray, propertyRangeArray)}
                </div>
            </div>
            <div className="main-img">
                <img
                    style={tinyModulate && {
                        left: tinyModulate.left,
                        top: tinyModulate.top
                    }}
                    src={imgArray && imgArray[selectImgIndex]}
                    alt="mainImg"
                />
            </div>
        </div>
    );
};

export default CardTemplate2;