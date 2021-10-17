import React, {useEffect, useState} from 'react';
import {addParticipator, getOneActivity} from "@/api/v1/activity";
import {useHistory, useRouteMatch} from "react-router-dom";
import Loading from "@/basicComponent/Loading";
import {mdParser} from "@/utils/mdParser";
import Button from '@/basicComponent/Button';
import {ExpandIcon, NoExpandIcon} from "@/assets/icon/iconComponent";
import ImgModal from "@/pages/main/publicComponent/imgModal";
import ParticipatorList from "@/pages/main/activityDetails/praticipatorList";
import useLocalStorage from "@/customHook/useLocalStorage";
import {showToast} from "@/utils/lightToast";

import "./index.less";

const Index = () => {
    const [data, setData] = useState({} as { [key: string]: any })

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [modalVisible, setModalVisible] = useState(false)

    const [expandVisible, setExpandVisible] = useState(false)

    const [getLocalStorage] = useLocalStorage()

    const match = useRouteMatch()

    const history = useHistory()

    const activityId = (match.params as any).activityId

    const userId = getLocalStorage("userId")

    useEffect(() => {
        document.body.scrollTo({top:0})
        getData()
    }, [])

    const getData = () => {
        setLoadingVisible(true)
        getOneActivity({
            activityId,
            participatorId: userId
        }).then(res => {
            res.status === 200 && setData(res.data)
            setLoadingVisible(false)
        })
    }

    const {
        id, name, startTime, endTime,
        recommend, rule, mainImg, participatorId,
        address, prizePeople, participatorNum, isOutTime
    } = data

    const getIsExpired = (endTime: string, isOutTime: number) => {
        const replaceTime = endTime?.replace(/-/g, '/')
        const nowTimeUnix = new Date().getTime()
        const endTimeUnix = new Date(replaceTime).getTime()
        const distanceHours = ((endTimeUnix - nowTimeUnix) / 360_0000)
        return !(isOutTime === 1 || distanceHours < 0)
    }

    return (
        <React.Fragment>
            <div className="activity-details-container publicFadeIn-500ms">
                <div className="name">{name}</div>
                <div className="time-group">
                    <div>{startTime}</div>
                    <div>至</div>
                    <div>{endTime}</div>
                </div>
                {prizePeople && <div className="prizePeople">
                    <div className="rule" dangerouslySetInnerHTML={{
                        __html: prizePeople && mdParser.render(prizePeople)
                    }}/>
                </div>}
                <div className="recommend-and-rule">
                    <div className="recommend">{recommend}</div>
                    <div className="expand-container">
                        <div
                            className="expand-container-label"
                            onClick={() => {
                                setExpandVisible(pre => !pre)
                            }}
                        >
                            <div>
                                文字版规则(点我展开)
                            </div>
                            <div>
                                {expandVisible ? <ExpandIcon/> : <NoExpandIcon/>}
                            </div>
                        </div>
                        <div
                            className="expand-container-content"
                            style={{height: expandVisible ? "100%" : 0}}
                        >
                            <div className="rule" dangerouslySetInnerHTML={{
                                __html: rule && mdParser.render(rule)
                            }}/>
                        </div>
                    </div>
                </div>
                <div className="action">
                    <ParticipatorList activityId={activityId}/>
                    <div className="address">
                        {address && <Button onClick={() => {
                            history.push(address)
                        }}>
                            去活动页
                        </Button>}
                        {getIsExpired(endTime, isOutTime) && <Button onClick={() => {
                            if (participatorId > 0) {
                                showToast("你已参加该活动")
                                return
                            }
                            setLoadingVisible(true)
                            addParticipator({
                                activityId: id,
                                participatorId: userId
                            }).then(res => {
                                if (res.status === 200) {
                                    showToast("报名成功")
                                    getData()
                                }
                                setLoadingVisible(false)
                            })
                        }}>
                            <span>{participatorId === 0 ? "报名" : "已参加"}</span>
                            <span>{`(共${participatorNum}人参加)`}</span>
                        </Button>}
                    </div>
                </div>
                <div
                    className="main-img"
                    onClick={() => {
                        setModalVisible(true)
                    }}
                >
                    <img src={mainImg} alt="mainImg"/>
                </div>
            </div>
            <Loading visible={loadingVisible}/>
            <ImgModal
                visible={modalVisible}
                imgArray={[mainImg]}
                setVisible={() => {
                    setModalVisible(false)
                }}
                initializeImgIndex={0}
            />
        </React.Fragment>
    );
};

export default Index;