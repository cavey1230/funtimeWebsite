import React, {useEffect, useState} from 'react';

import {SearchPad} from "@/pages/main/introduction/searchPad";
import useGetIndexedDbData from "@/customHook/useGetIndexedDBData";
import {getIntroductionData} from "@/api/v1/introduction";
import {ConditionParams} from "@/utils/indexedDb";
import usePagination from "@/customHook/usePagination";
import useLocalStorage from "@/customHook/useLocalStorage";
import {IntroductionList} from "@/pages/main/introduction/introductionList";
import Screening from "@/basicComponent/Screening";
import {useKeepaliveNameControl} from "@/customHook/useKeepaliveNameControl";
import Loading from '@/basicComponent/Loading';

import "./index.less";

const Index = () => {
    const [nameList, setNameList] = useState({
        server: [],
        area: [],
        role: [],
        race: [],
        career: []
    })

    const [dataList, setDataList] = useState([])

    const [condition, setCondition] = useState({} as { [key: string]: string | number })

    const [screeningCondition, setScreeningCondition] = useState([])

    const [introductionTotal, setIntroductionTotal] = useState(0)

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [pagination, setPagination] = usePagination(
        1, //初始页码
        12, //初始条数
        introductionTotal, //总条数
        {delay: 100, key: "introduction", tipsString: "没有更多个人情报啦"} //下滑延迟
    )

    const [getLocalStorage] = useLocalStorage()

    //页面缓存控制,激活当前页面时会卸载掉name为数组内字符串的缓存
    useKeepaliveNameControl(["普通动态", "滚动动态", "消息", "个人情报"])

    const publicIndexedDBCondition: ConditionParams = {model: "all", limit: "more"}

    useGetIndexedDbData(Object.keys(nameList).map((item) => {
        return {tableName: item, condition: publicIndexedDBCondition}
    }), (result) => {
        setNameList(result)
    })

    useEffect(() => {
        pagination.pageNum === 1 ?
            getData(condition, pagination, true) :
            getData(condition, pagination)
    }, [pagination])

    useEffect(() => {
        setPagination({pageNum: 1, pageSize: 12})
    }, [condition, screeningCondition])

    const getData = (
        conditionParams: typeof condition,
        paginationParams: typeof pagination,
        reload?: boolean
    ) => {
        const loginUserId = getLocalStorage("userId")
        const {pageNum, pageSize} = paginationParams
        const innerConditionParams = {...conditionParams}
        if (screeningCondition.length > 0) {
            const [key, value] = screeningCondition
            innerConditionParams[key] = value
        }
        setLoadingVisible(true)
        getIntroductionData({
            pageNum, pageSize,
            loginUserId, ...innerConditionParams
        }).then(res => {
            if (res.status === 200) {
                setIntroductionTotal(res.data.total)
                if (!Array.isArray(res.data.result)) {
                    setLoadingVisible(false)
                    setDataList([])
                    return
                }
                reload ? setDataList([...res.data.result]) :
                    setDataList([...dataList, ...res.data.result])
            }
            setLoadingVisible(false)
        })
    }

    return (
        <React.Fragment>
            <div className="introduction-container">
                <div className="introduction-search">
                    <SearchPad
                        nameList={nameList}
                        onFinish={(value) => {
                            setCondition({...value})
                        }}
                    />
                </div>
                <Screening
                    setCondition={(array) => {
                        setScreeningCondition([...array])
                    }}
                    style={{width: "50%", minWidth: "35rem"}}
                    labelArray={[{
                        name: "时间",
                        key: "timeControl"
                    }, {
                        name: "查看数",
                        key: "watchControl"
                    }, {
                        name: "喜欢数",
                        key: "likeControl"
                    }]}
                />
                <div className="introduction-list">
                    <IntroductionList
                        dataList={dataList}
                        nameList={nameList}
                        setDataList={setDataList}
                    />
                </div>
            </div>
            <Loading visible={loadingVisible}/>
        </React.Fragment>
    );
}


export default Index;