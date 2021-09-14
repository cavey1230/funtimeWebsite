import React, {useEffect, useState} from 'react';
import {createIntroductionWatch, getIntroductionData} from "@/api/v1/introduction";
import useLocalStorage from "@/customHook/useLocalStorage";
import {useRouteMatch} from "react-router-dom";
import {ConditionParams} from "@/utils/indexedDb";
import useGetIndexedDbData from "@/customHook/useGetIndexedDBData";
import Loading from "@/basicComponent/Loading";
import {CategoryCareer} from './categoryCareer';
import ActionGroup from "@/pages/main/introductionDetails/actionGroup";
import BasicInfo from "@/pages/main/introductionDetails/basicInfo";
import PropertyInfo from "@/pages/main/introductionDetails/propertyInfo";
import ThumbnailImg from "@/pages/main/introductionDetails/thumbnailImg";

import "./index.less";

const Index = () => {
    const [data, setData] = useState({} as { [key: string]: any })

    const [nameList, setNameList] = useState({
        server: [],
        area: [],
        role: [],
        race: [],
        career: [],
        property: []
    })

    const [getLocalStorage] = useLocalStorage()

    const match = useRouteMatch()

    const [loadingVisible, setLoadingVisible] = useState(false)

    const publicIndexedDBCondition: ConditionParams = {model: "all", limit: "more"}

    useGetIndexedDbData(Object.keys(nameList).map((item) => {
        return {tableName: item, condition: publicIndexedDBCondition}
    }), (result) => {
        setNameList(result)
    })

    useEffect(() => {
        document.body.scrollTo({
            top: 0
        })
        const loginUserId = getLocalStorage("userId")
        const {params} = match
        setLoadingVisible(true)
        getIntroductionData({
            pageNum: 1, pageSize: 1,
            loginUserId: loginUserId,
            userId: Number((params as any).userId)
        }).then(res => {
            if (!Array.isArray(res.data.result)) {
                return
            }
            const data = res.data.result[0]
            !data.hasWatched && createIntroductionWatch({
                userId: loginUserId,
                introductionId: data.id
            }).then(res => {
                if (res.status === 200) {
                    setData({...data, watchNum: data.watchNum + 1})
                }
            })
            setLoadingVisible(false)
            setData(data)
        })
    }, [])

    const {
        server: serverList,
        area: areaList,
        race: raceList,
        role: roleList,
        career: careerList,
        property: propertyList,
    } = nameList

    const {
        mainImg, careerIdArray, imgArray,
        propertyIdArray, propertyRangeArray
    } = data

    return (
        <React.Fragment>
            <div className="introduction-details-content publicFadeIn-500ms">
                <div className="basic-info-container">
                    {/*基础信息*/}
                    <BasicInfo
                        roleList={roleList}
                        serverList={serverList}
                        areaList={areaList}
                        raceList={raceList}
                        careerList={careerList}
                        data={data}
                    />
                    {/*职业分类*/}
                    <CategoryCareer
                        careerList={careerList}
                        selectedList={careerIdArray}
                        width={"30%"}
                    />
                    {/*操作栏*/}
                    <ActionGroup
                        setData={setData}
                        data={data}
                        roleList={roleList}
                    />
                    {/*属性*/}
                    <PropertyInfo
                        propertyList={propertyList}
                        propertyIdArray={propertyIdArray}
                        propertyRangeArray={propertyRangeArray}
                    />
                    {/*缩略图*/}
                    <ThumbnailImg imgArray={imgArray}/>
                </div>
                <div className="main-img">
                    <img src={mainImg && mainImg} alt="mainImg"/>
                </div>
            </div>
            <Loading visible={loadingVisible}/>
        </React.Fragment>
    );
};

export default Index;