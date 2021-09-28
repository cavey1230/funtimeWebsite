import React, {useEffect, useState} from 'react';

import FieldsetContainer from "@/pages/main/userCenter/publicComponent/fieldsetContainer";
import {Tab} from "@/basicComponent/Tab";
import useLocalStorage from "@/customHook/useLocalStorage";
import {findCommunityLike} from "@/api/v1/community";
import {findIntroductionLike} from "@/api/v1/introduction";
import Loading from "@/basicComponent/Loading";
import Pagination from "@/basicComponent/Pagination";
import {getMarkDownContent} from "@/utils/stringMatchingTool";
import useTimeChanger from "@/customHook/useTimeChanger";
import Button from '@/basicComponent/Button';
import {useHistory} from "react-router-dom";

import "./recentlyLike.less";

const RecentlyLike = () => {
    const labelArray = [{
        title: "动态",
        id: 0
    }, {
        title: "个人情报",
        id: 1
    }]

    const initializePagination = {
        pageNum: 1,
        pageSize: 12
    }

    const [pagination, setPagination] = useState(initializePagination)

    const [total, setTotal] = useState(0)

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [selectId, setSelectId] = useState(0)

    const [dataList, setDataList] = useState([])

    const [getLocalStorage] = useLocalStorage()

    const timeChanger = useTimeChanger()

    const history = useHistory()

    useEffect(() => {
        setPagination(initializePagination)
    }, [selectId])

    useEffect(() => {
        const key = selectId === 0 ? "community" : "introduction"
        getDataList(key)
    }, [pagination])

    const getDataList = (model: "community" | "introduction") => {
        const userId = getLocalStorage("userId")
        const {pageNum, pageSize} = pagination
        const data = {pageNum, pageSize, userId}
        setLoadingVisible(true)
        const innerPromise = model === "community" ?
            findCommunityLike(data) : findIntroductionLike(data)
        innerPromise.then(res => {
            if (res.status === 200) {
                console.log(res.data)
                setDataList(res.data.data)
                setTotal(res.data.total)
            }
            setLoadingVisible(false)
        })
    }

    const renderDataList = (dataList: Array<any>, selectId: Number) => {
        const renderContent = (item: {
            isHeightOrderModel: number
            content: string | undefined
            gameRoleName: string | undefined
        }) => {
            const {isHeightOrderModel, content, gameRoleName} = item
            return selectId === 0 ? <div>
                <span style={{fontWeight:600}}>{isHeightOrderModel === 1 ? "长文内容为:" : "内容为:"}</span>
                {isHeightOrderModel === 1 ? getMarkDownContent(content) : content}
            </div> : <div>
                角色名为:{gameRoleName}
            </div>
        }

        return dataList?.map(item => {
            const {
                id, createTime, content,
                gameRoleName, isHeightOrderModel,
                introductionUserId,communityId
            } = item
            return <div
                className="user-center-recently-like-data-item"
                key={id}
            >
                <div>
                    <div className="time">{timeChanger(createTime)}</div>
                    <div>
                        {renderContent({content, gameRoleName, isHeightOrderModel})}
                    </div>
                </div>
                <div>
                    <Button onClick={() => {
                        history.push(selectId === 0 ?
                            `/main/details/${communityId}` :
                            `/main/introduction/details/${introductionUserId}`)
                    }}>
                        去查看
                    </Button>
                </div>
            </div>
        })
    }

    return (
        <React.Fragment>
            <div className="user-center-recently-like-info-container">
                <FieldsetContainer title={"最近点赞"}>
                    <Tab
                        labelArr={labelArray}
                        onChange={(selectId) => {
                            setSelectId(selectId)
                        }}
                        initializeSelectId={0}
                        blockDisplay={true}
                        allowScroll={true}
                    >
                        <div
                            id={String(selectId)}
                            className="user-center-recently-like-content-item"
                        >
                            <div className="user-center-recently-like-content-item">
                                {renderDataList(dataList, selectId)}
                            </div>
                            <Pagination
                                total={total}
                                pagination={pagination}
                                setPagination={setPagination}
                                height={"6rem"}
                                layoutOptions={{
                                    left: "25%",
                                    center: "50%",
                                    right: "25%"
                                }}
                            />
                        </div>
                    </Tab>
                </FieldsetContainer>
            </div>
            <Loading visible={loadingVisible}/>
        </React.Fragment>
    );
};

export default RecentlyLike;