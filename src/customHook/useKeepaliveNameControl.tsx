import React, {useEffect} from 'react';
import {useActivate, useUnactivate, useAliveController} from 'react-activation';
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";

export const useKeepaliveNameControl = (nameList: Array<string>, showLog: boolean = false) => {

    const {dropScope, getCachingNodes} = useAliveController()

    useActivate(() => {
        const hasKeepaliveNameList = getCachingNodes().map(item => item.name)
        nameList.forEach((item) => {
            if (hasKeepaliveNameList.includes(item)) {
                dropScope(item).then(res => {
                    if (showLog) {
                        console.log(res)
                        console.log(getCachingNodes())
                    }
                })
            }
        })
    })
};

export const useLimitBodyScroll = () => {
    const isMobile = useSelector((store: ReduxRootType) => {
        return store.windowResizeReducer.isMobile
    })

    useEffect(() => {
        isMobile && (document.body.style.overflowY = "hidden")
        isMobile && document.body.scrollTo({top:0})
        return () => {
            isMobile && (document.body.style.overflowY = "auto")
        }
    }, [])

    useActivate(() => {
        isMobile && document.body.scrollTo({top:0})
        isMobile && (document.body.style.overflowY = "hidden")
    })

    useUnactivate(() => {
        isMobile && (document.body.style.overflowY = "auto")
    })
}

export const useClearKeepalive = () => {
    useKeepaliveNameControl([
        "普通动态", "滚动动态", "文章中心", "消息", "个人情报", "活动详情", "个人主页", "搜索结果"
    ], false)
}

export const useClearKeepaliveWithoutMessage = () => {
    useKeepaliveNameControl([
        "普通动态", "滚动动态", "文章中心", "个人情报", "活动详情", "个人主页", "搜索结果"
    ], false)
}