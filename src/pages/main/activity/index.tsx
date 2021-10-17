import React, {useEffect, useMemo, useState} from 'react';

import {useClearKeepalive} from "@/customHook/useKeepaliveNameControl";
import Loading from '@/basicComponent/Loading';
import {getActivityList} from "@/api/v1/activity";
import ActivityListItem from "@/pages/main/activity/activityListItem";

import "./index.less";

const Index = () => {
    const [dataList, setDataList] = useState([])

    const [loadingVisible, setLoadingVisible] = useState(false)

    //页面缓存控制,激活当前页面时会卸载掉name为数组内字符串的缓存
    useClearKeepalive()

    useEffect(() => {
        document.body.scrollTo({top:0})
        getData()
    }, [])

    const getData = () => {
        setLoadingVisible(true)
        getActivityList().then(res => {
            if (res.status === 200) {
                if (!Array.isArray(res.data)) {
                    setLoadingVisible(false)
                    setDataList([])
                    return
                }
                setDataList([...res.data])
            }
            setLoadingVisible(false)
        })
    }

    const categoryActivity = useMemo(() => {
        const nowTimeUnix = new Date().getTime()
        return dataList && dataList.reduce((store, next) => {
            const replaceTime = next.endTime?.replace(/-/g, '/')
            const endTime = new Date(replaceTime).getTime()
            const distanceHours = ((endTime - nowTimeUnix) / 360_0000)
            if (next.isOutTime === 1 || distanceHours < 0) {
                next.isOutTime = 1
                store.expired.push(next)
            } else {
                store.happening.push(next)
            }
            return store
        }, {happening: [], expired: []})
    }, [dataList])

    const renderActivityList = (arr: Array<any>) => {
        if (arr?.length === 0) {
            return <div className="empty">
                暂无活动
            </div>
        }
        return arr?.map((item, index) => {
            return <ActivityListItem
                key={item.id}
                item={item}
                index={index}
            />
        })
    }

    return (
        <React.Fragment>
            <div className="activity-container publicFadeIn-500ms">
                <div className="activity-container-label">
                    <span>进行中</span>
                </div>
                <div className="activity-list">
                    {renderActivityList(categoryActivity.happening)}
                </div>
                <div className="activity-container-label">
                    <span>已过期</span>
                </div>
                <div className="activity-list">
                    {renderActivityList(categoryActivity.expired)}
                </div>
            </div>
            {/*<Footer/>*/}
            <Loading visible={loadingVisible}/>
        </React.Fragment>
    );
}


export default Index;