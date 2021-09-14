import React, {useEffect, useRef, useState} from 'react';

import ActionBar from "./actionBar";
import {getCommunityList, getCommunityListParams, getTopicList} from "@/api/v1/community";
import {Tab} from "@/basicComponent/Tab";
import {Waterfall} from "./waterfall";
import Loading from "@/basicComponent/Loading";
import Screening from "@/basicComponent/Screening";
import useLocalStorage from "@/customHook/useLocalStorage";
import usePagination from '@/customHook/usePagination';
import {TopicIcon} from "@/assets/icon/iconComponent";
import {useKeepaliveNameControl} from "@/customHook/useKeepaliveNameControl";
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";

import "./index.less";

interface TopicListItem {
    createTime: string
    deleteTime: string
    id: number
    isOutdated: number
    name: string
    type: string
    updateTime: string
}

const Index = () => {

    //动态集合
    const [communityData, setCommunityData] = useState([])

    //动态条数
    const [communityTotal, setCommunityTotal] = useState(0)

    //话题集合
    const [topicList, setTopicList] = useState([] as Array<TopicListItem>)

    //选中话题Id
    const [selectTopicId, setSelectTopicId] = useState(1)

    //控制loading显示隐藏
    const [loadingVisible, setLoadingVisible] = useState(false)

    //下方筛选条件
    const [condition, setCondition] = useState([] as Array<string>)

    //填充高度，瀑布流会让高度消失
    const [fillHeight, setFillHeight] = useState(0 as string | number)

    //容器Ref，切换话题时防止高度坍塌
    const containerRef = useRef(null)

    const [getLocalStorage] = useLocalStorage()

    const isMobile = useSelector((state: ReduxRootType) => {
        return state.windowResizeReducer.isMobile
    })

    //页面缓存控制,激活当前页面时会卸载掉name为数组内字符串的缓存
    useKeepaliveNameControl(["普通动态", "滚动动态", "消息"])

    const [pagination, setPagination] = usePagination(
        1, //初始页码
        8, //初始条数
        communityTotal, //总条数
        {delay: 100, key: "community", tipsString: "没有更多动态啦"} //下滑延迟
    )

    useEffect(() => {
        getTopicList({
            type: "官方话题",
            isOutdated: "0"
        }).then(res => {
            if (res.status === 200) {
                const data = res.data.data
                localStorage.setItem("topicList", JSON.stringify(data))
                setTopicList(data)
            }
        })
    }, [])

    useEffect(() => {
        setPagination({
            pageNum: 1,
            pageSize: 8
        })
        getCommunityListData(selectTopicId, 1, 8, true)
    }, [selectTopicId, condition])

    useEffect(() => {
        const {pageNum, pageSize} = pagination
        if (pageNum > 1) {
            getCommunityListData(selectTopicId, pageNum, pageSize)
        }
    }, [pagination])

    const getCommunityListData = (topicId: number, pageNum: number, pageSize: number, reload?: boolean) => {
        setLoadingVisible(true)
        const userId = getLocalStorage("userId")
        const data: getCommunityListParams = {
            pageNum, pageSize,
            topicId: topicId,
        }
        condition ? data[condition[0]] = condition[1] : null
        userId ? data["loginUserId"] = userId : null
        getCommunityList(data).then(res => {
            if (res.status === 200) {
                reload ? setCommunityData(res.data.data ? [...res.data.data] : []) :
                    setCommunityData([...communityData, ...res.data.data])
                setCommunityTotal(res.data.total)
            }
            setLoadingVisible(false)
        })
    }

    const getTopicObject = (topicList: TopicListItem[]) => {
        return topicList?.map(item => {
            const {name, id} = item
            return {
                title: name,
                id, icon: <TopicIcon/>
            }
        })
    }

    return (
        <React.Fragment>
            <div className="community-pad">
                <div className="action-bar-container">
                    <ActionBar flushDataFunc={() => {
                        getCommunityListData(
                            selectTopicId,
                            1, pagination.pageSize, true
                        )
                    }}/>
                </div>
                <div className="content-pad">
                    <Tab
                        labelArr={getTopicObject(topicList)}
                        onChange={(selectTopicId) => {
                            setSelectTopicId(selectTopicId)
                        }}
                        initializeSelectId={1}
                        blockDisplay={true}
                        allowScroll={true}
                    >
                        <div
                            id={String(selectTopicId)}
                            className="content-container"
                            ref={containerRef}
                            style={{height: fillHeight > 0 && fillHeight}}
                        >
                            <Screening
                                setCondition={(array) => {
                                    const offsetHeight = containerRef.current.offsetHeight
                                    setFillHeight(offsetHeight)
                                    setCondition([...array])
                                    setTimeout(() => {
                                        setFillHeight("100%")
                                    }, 500)
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
                                }, {
                                    name: "评论数",
                                    key: "messageControl"
                                }]}
                            />
                            <Waterfall
                                options={{
                                    columns: getLocalStorage("isMobile") ? 2 : 4,
                                    columns_gap: isMobile ? "5px" : "10px"
                                }}
                                dataArray={communityData}
                                setData={(data) => {
                                    setCommunityData(data)
                                }}
                            />
                        </div>
                    </Tab>
                </div>
            </div>
            <Loading visible={loadingVisible}/>
        </React.Fragment>
    );
};

export default Index;