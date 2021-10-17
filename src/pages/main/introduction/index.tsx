import React, {useEffect, useState} from 'react';

import {SearchPad} from "@/pages/main/introduction/searchPad";
import {getIntroductionData} from "@/api/v1/introduction";
import usePagination from "@/customHook/usePagination";
import useLocalStorage from "@/customHook/useLocalStorage";
import {IntroductionList} from "@/pages/main/introduction/introductionList";
import Screening from "@/basicComponent/Screening";
import {useClearKeepalive, useLimitBodyScroll} from "@/customHook/useKeepaliveNameControl";
import Loading from '@/basicComponent/Loading';
import useGetNameList from "@/customHook/useGetNameList";
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";

import "./index.less";

const Index = () => {
    const nameList = useGetNameList()

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

    const isMobile = useSelector((store: ReduxRootType) => {
        return store.windowResizeReducer.isMobile
    })

    const [getLocalStorage] = useLocalStorage()

    //页面缓存控制,激活当前页面时会卸载掉name为数组内字符串的缓存
    useClearKeepalive()

    //禁止滚动
    useLimitBodyScroll()

    useEffect(() => {
        getData(condition, pagination, pagination.pageNum === 1)
    }, [pagination])

    useEffect(() => {
        (Object.keys(condition).length > 0 || screeningCondition.length > 0) &&
        setPagination({pageNum: 1, pageSize: 12})
    }, [condition, screeningCondition])

    const scrollGetData = (callback: () => void) => {
        const {pageSize, pageNum} = pagination
        if ((pageSize * pageNum) < introductionTotal) {
            setPagination({pageSize, pageNum: pageNum + 1})
            getData(condition, {
                pageSize, pageNum: pageNum + 1
            }, false, callback)
        }
    }

    const getData = (
        conditionParams: typeof condition,
        paginationParams: typeof pagination,
        reload: boolean,
        callback?: () => void
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
            callback && callback()
            setLoadingVisible(false)
        })
    }

    const {pageNum, pageSize} = pagination

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
                    style={{
                        width: "50%",
                        minWidth: "35rem",
                        margin: isMobile && "0 auto"
                    }}
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
                        condition={condition}
                        isMobile={isMobile}
                        haveData={(pageSize * pageNum) < introductionTotal}
                        scrollGetData={scrollGetData}
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