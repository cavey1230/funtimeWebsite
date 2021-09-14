import React, {useEffect, useRef, useState} from 'react';

import useLocalStorage from "@/customHook/useLocalStorage";
import Badeg from '@/basicComponent/Badeg';
import {useSelector} from "react-redux";
import classnames from '@/utils/classnames';
import {showToast} from "@/utils/lightToast";
import {ReduxRootType} from "@/config/reducers";

import "./messageContainer.less";

export interface Props {

    //左侧条件筛选
    leftConditionLabel: Array<{
        label: string,
        key: string,
        id: number
    }>

    //数据获取
    getData: (
        userId: number,
        pageSize: number,
        pageNum: number,
        condition: string,
        setMessageTotal: (total: number) => void,
        setMessageArray: (array: Array<any>) => void,
        messageArray: Array<any>,
        reload: boolean
    ) => void

    //总数详细
    totalDetails: { [key: string]: number }

    //渲染子组件
    dataList: (
        data: Array<any>,
        userId: number,
        flushData: (userId: number,reload:boolean) => void
    ) => JSX.Element | Array<JSX.Element>

    //初始条数
    initializePageSize: number

    //初始页数
    initializePageNum: number
}

const MessageContainer: React.FC<Props> = (props) => {

    const {leftConditionLabel, getData, totalDetails, initializePageSize, initializePageNum, dataList} = props

    const [userIdOfState, setUserIdOfState] = useState(0)

    const [pagination, setPagination] = useState({
        pageNum: initializePageNum,
        pageSize: initializePageSize
    })

    const [messageArray, setMessageArray] = useState([])

    const [messageTotal, setMessageTotal] = useState(0)

    const [condition, setCondition] = useState("all")

    const [getLocalStorage] = useLocalStorage()

    const scrollRef = useRef(null)

    const isMobile = useSelector((state: ReduxRootType) => {
        return state.windowResizeReducer.isMobile
    })

    useEffect(() => {
        const {pageNum, pageSize} = pagination
        scrollRef.current.onscroll = () => {
            const scrollHeight = scrollRef.current.scrollHeight
            const scrollTop = scrollRef.current.scrollTop
            const offsetHeight = scrollRef.current.offsetHeight
            if (scrollTop + offsetHeight === scrollHeight) {
                // console.log("触发")
                if ((pageNum * pageSize) < messageTotal) {
                    setPagination({...pagination, pageNum: pageNum + 1})
                } else {
                    showToast("没有更多了", "warning")
                }
            }
        }
    }, [pagination, messageTotal])

    useEffect(() => {
        scrollRef.current?.scrollTo({top: 0})
        condition && setMessageArray([])
        condition && setPagination({
            pageNum: initializePageNum,
            pageSize: initializePageSize
        })
    }, [condition])

    useEffect(() => {
        const userId = Number(getLocalStorage("userId"))
        setUserIdOfState(userId)
        userIdOfState && getAllMessageData(userId, false)
    }, [pagination])

    const getAllMessageData = (userId: number, reload: boolean) => {
        const {pageNum, pageSize} = pagination
        getData(userId, pageSize, pageNum,
            condition, setMessageTotal,
            setMessageArray, messageArray, reload)
    }

    const renderLeftConditionItem = (
        array: typeof leftConditionLabel,
        isMobile: boolean,
        setCondition: (condition: string) => void
    ) => {
        const handleClick = (key: string) => {
            setCondition(key)
        }
        return array.map((item) => {
            const {label, key, id} = item
            const autoTop = isMobile ? condition === key ? "-10%" : "-50%" : "10%"
            const autoLeft = isMobile ? condition === key ? "105%" : "100%" : "80%"
            const total = totalDetails && totalDetails.hasOwnProperty(key) ? totalDetails[key] : 0
            return <div
                className="message-condition-item"
                key={id}
                onClick={() => {
                    handleClick(key)
                }}
            >
                <Badeg
                    targetNum={total}
                    top={autoTop}
                    left={autoLeft}
                    fullwidth={!isMobile}
                    badegSize={isMobile ? "small" : "middle"}
                >
                    <div className={classnames(
                        "message-condition-item-label",
                        {"message-condition-item-selected": condition === key})}>
                        {label}
                    </div>
                </Badeg>
            </div>
        })
    }

    return (
        <div className="message-out-container">
            <div className="message-left-pad">
                {renderLeftConditionItem(leftConditionLabel, isMobile, setCondition)}
            </div>
            <div className="message-right-pad">
                <div className="message-inner-container" ref={scrollRef}>
                    {dataList(messageArray, userIdOfState, getAllMessageData)}
                </div>
            </div>
        </div>
    );
};

export default MessageContainer;