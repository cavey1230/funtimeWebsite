import React, {useEffect, useRef, useState} from 'react';

import {getCommunityList, getCommunityListParams, getTopicList} from "@/api/v1/community";
import {Waterfall} from "./waterfall";
import Loading from "@/basicComponent/Loading";
import useLocalStorage from "@/customHook/useLocalStorage";
import usePagination from '@/customHook/usePagination';
import {useClearKeepalive, useLimitBodyScroll} from "@/customHook/useKeepaliveNameControl";
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";
import {ReleaseModal, ScreenModal, TopicModal} from "@/pages/main/community/releaseModal";
import Button from "@/basicComponent/Button";
import {ReleaseIcon, ScreenIcon, TopicIcon} from "@/assets/icon/iconComponent";
import Screening from "@/basicComponent/Screening";
import ActionBar from "@/pages/main/community/actionBar";
import MiniTabLabel from "@/pages/main/community/miniTabLabel";

import "./index.less";

export interface TopicListItem {
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

    //模态框显示隐藏
    const [modalVisible, setModalVisible] = useState({
        release: false,
        topic: false,
        screen: false
    })

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
    useClearKeepalive()

    //禁止滚动
    useLimitBodyScroll()

    //手机端和pc端滚动页面都会使用该方法
    const [pagination, setPagination] = usePagination(
        1, //初始页码
        12, //初始条数
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
        if (!isMobile && pagination.pageNum > 1) {
            const {pageSize, pageNum} = pagination
            getCommunityListData(
                selectTopicId, pageNum, pageSize, false
            )
        }
    }, [pagination])

    useEffect(() => {
        reloadData()
    }, [selectTopicId, condition])

    const reloadData = () => {
        setPagination({pageNum: 1, pageSize: 12})
        getCommunityListData(selectTopicId, 1, 12, true)
    }

    const getData = (
        callback: () => void
    ) => {
        const {pageSize, pageNum} = pagination
        const innerCallback = () => {
            callback()
            setPagination({pageSize, pageNum: pageNum + 1})
        }
        if ((pageNum * pageSize) < communityTotal) {
            getCommunityListData(
                selectTopicId, pageNum + 1,
                pageSize, false, innerCallback
            )
        } else {
            callback()
        }
    }

    const getCommunityListData = (
        topicId: number, pageNum: number,
        pageSize: number, reload: boolean,
        callback?: () => void
    ) => {
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
            callback && callback()
            setLoadingVisible(false)
        })
    }

    const setModalVisibleWithKey = (key: "release" | "screen" | "topic", data: boolean) => {
        setModalVisible({...modalVisible, [key]: data})
    }

    return (
        <React.Fragment>
            <div className="community-pad">
                {isMobile ? <div className="community-pad-inner-navigate">
                    <div className="inner-navigate-button">
                        <Button onClick={() => {
                            setModalVisibleWithKey("release", true)
                        }}>
                            <ReleaseIcon/>
                            <span>发布动态</span>
                        </Button>
                    </div>
                    <div className="inner-navigate-button">
                        <Button onClick={() => {
                            setModalVisibleWithKey("topic", true)
                        }}>
                            <TopicIcon/>
                            <span>切换话题</span>
                        </Button>
                    </div>
                    <div className="inner-navigate-button">
                        <Button onClick={() => {
                            setModalVisibleWithKey("screen", true)
                        }}>
                            <ScreenIcon/>
                            <span>筛选</span>
                        </Button>
                    </div>
                </div> : <React.Fragment>
                    <div className="action-bar-container">
                        <ActionBar flushDataFunc={() => {
                            reloadData()
                        }}/>
                    </div>
                    <MiniTabLabel
                        selectTopicId={selectTopicId}
                        setSelectTopicId={setSelectTopicId}
                        labelArray={topicList}
                    />
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
                </React.Fragment>}
                <div className="content-pad">
                    <div
                        id={String(selectTopicId)}
                        className="content-container"
                        ref={containerRef}
                        style={{height: fillHeight > 0 && fillHeight}}
                    >
                        <Waterfall
                            isMobile={isMobile}
                            haveData={(pagination.pageNum *
                                pagination.pageSize) < communityTotal
                            }
                            selectTopicId={selectTopicId}
                            condition={condition}
                            getData={getData}
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
                </div>
            </div>
            <Loading visible={loadingVisible}/>
            {isMobile && <React.Fragment>
                <ReleaseModal
                    visible={modalVisible.release}
                    setVisible={() => {
                        setModalVisibleWithKey("release", false)
                    }}
                    reloadData={reloadData}
                />
                <TopicModal
                    selectTopicId={selectTopicId}
                    setSelectTopicId={setSelectTopicId}
                    labelArray={topicList}
                    visible={modalVisible.topic}
                    setVisible={() => {
                        setModalVisibleWithKey("topic", false)
                    }}
                />
                <ScreenModal
                    initializeData={condition}
                    containerRef={containerRef}
                    setFillHeight={setFillHeight}
                    setCondition={setCondition}
                    visible={modalVisible.screen}
                    setVisible={() => {
                        setModalVisibleWithKey("screen", false)
                    }}
                />
            </React.Fragment>}
        </React.Fragment>
    );
};

export default Index;