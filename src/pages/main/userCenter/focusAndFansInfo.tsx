import React, {useEffect, useState} from 'react';

import FieldsetContainer from "@/pages/main/userCenter/publicComponent/fieldsetContainer";
import {Tab} from "@/basicComponent/Tab";
import useLocalStorage from "@/customHook/useLocalStorage";
import {getFocusList, getFansList, hasFocus} from "@/api/v1/fansAndFocus";

import Loading from "@/basicComponent/Loading";
import Pagination from "@/basicComponent/Pagination";
import PublicAvatar from "@/pages/main/publicComponent/publicAvatar";
import FocusButton from "@/pages/main/publicComponent/focusButton";

import "./focusAndFansInfo.less";

const FocusAndFansInfo = () => {
    const labelArray = [{
        title: "粉丝",
        id: 0
    }, {
        title: "关注",
        id: 1
    }]

    const initializePagination = {
        pageNum: 1,
        pageSize: 8
    }

    const [pagination, setPagination] = useState(initializePagination)

    const [total, setTotal] = useState(0)

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [selectId, setSelectId] = useState(0)

    const [dataList, setDataList] = useState([])

    const [getLocalStorage] = useLocalStorage()

    useEffect(() => {
        setPagination(initializePagination)
    }, [selectId])

    useEffect(() => {
        const key = selectId === 0 ? "fans" : "focus"
        getDataList(key)
    }, [pagination])

    const getDataList = (model: "fans" | "focus") => {
        const userId = getLocalStorage("userId")
        const {pageNum, pageSize} = pagination
        const data = {pageNum, pageSize, toUserId: userId}
        setLoadingVisible(true)
        const innerPromise = model === "fans" ?
            getFansList(data) : getFocusList(data)
        innerPromise.then(res => {
            if (res.status === 200) {
                console.log(res.data)
                setDataList(res.data.data)
                setTotal(res.data.total)
            }
            setLoadingVisible(false)
        })
    }

    const renderDataList = (dataList: Array<any>) => {
        return dataList?.map(item => {
            const {id, nickname, targetUserAvatar, userId, bothFocus,createTime} = item

            const getHasFocusStatus = (loginUserId: number) => {
                loginUserId && hasFocus({
                    followUserId: loginUserId,
                    targetUserId: Number(userId)
                }).then(() => {
                    getDataList(selectId === 0 ? "fans" : "focus")
                })
            }

            return <div
                className="user-center-focus-and-fans-data-item"
                key={id}
            >
                <div>
                    {createTime}
                </div>
                <div>
                    <PublicAvatar
                        avatarAddress={targetUserAvatar}
                        labelString={nickname}
                        justifyContent={"flex-start"}
                        alignItem={"center"}
                        mobileImgStyle={{width: "5rem"}}
                        pcImgStyle={{width: "5rem"}}
                        mobileLabelStyle={{fontSize: "1.4rem", fontWeight: "400"}}
                        pcLabelStyle={{fontSize: "1.4rem", fontWeight: "600"}}
                        expandModel={false}
                        targetUserId={userId}
                    />
                    <div className="action-group">
                        <FocusButton
                            communityUserId={Number(userId)}
                            hasFocus={selectId === 0 && (bothFocus === 1 ? 2 : 0)}
                            flushData={(loginUserId) => {
                                getHasFocusStatus(loginUserId)
                            }}
                        />
                    </div>
                </div>
            </div>
        })
    }

    return (
        <React.Fragment>
            <div className="user-center-focus-and-fans-info-container">
                <FieldsetContainer title={"粉丝与关注"}>
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
                            className="user-center-focus-and-fans-content-item"
                        >
                            <div className="user-center-focus-and-fans-statistic">
                                {`${selectId === 0 ? "粉丝" : "关注"}数:${total}`}
                            </div>
                            <div className="user-center-focus-and-fans-content-item">
                                {renderDataList(dataList)}
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

export default FocusAndFansInfo;