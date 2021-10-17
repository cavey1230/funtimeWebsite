import React, {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from "react-router-dom";
import {getPersonalHomePageData} from "@/api/v1/personalHome";
import useGetNameList from "@/customHook/useGetNameList";
import {getNameById} from "@/pages/main/introduction/introductionList";
import FocusButton from "@/pages/main/publicComponent/focusButton";
import useLocalStorage from "@/customHook/useLocalStorage";
import {getCareerImg} from "@/pages/main/introductionDetails/categoryCareer";
import {roleImgAddress} from '@/assets/img/returnImgByName';
import Button from '@/basicComponent/Button';
import AboutCommunity from "@/pages/main/personalHome/aboutCommunity";

import "./index.less";
import FansAndFocusModal, {Props} from "@/pages/main/personalHome/fansAndFocusModal";
import Loading from "@/basicComponent/Loading";

const Index = () => {
    const nameList = useGetNameList()

    const [data, setData] = useState({} as { [key: string]: any })

    const [model, setModel] = useState("" as Props["model"])

    const [fansAndFocusModal, setFansAndFocusModal] = useState(false)

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [getLocalStorage] = useLocalStorage()

    const match = useRouteMatch()

    const history = useHistory()

    const personalId = Number((match as any).params.userId)

    useEffect(() => {
        document.body.scrollTo({
            top: 0
        })
        getData()
    }, [])

    const getData = () => {
        setLoadingVisible(true)
        getPersonalHomePageData({
            userId: personalId,
            loginUserId: getLocalStorage("userId"),
        }).then(res => {
            setLoadingVisible(false)
            res.status === 200 && setData(res.data)
            document.title = res.data.nickname + "的个人主页"
        })
    }

    const {
        backgroundImg, avatar, nickname,
        experience, level, epithet, recommend,
        fansNum, focusNum, communityNum,
        mainImg, introductionId, gameRoleName,
        server, area, role, race, favoriteCareerId,
        focusStatus, activityList, showCommunity,
        showComment, showReply, maxCommunityTotal
    } = data

    const {
        server: serverList,
        area: areaList,
        role: roleList,
        race: raceList,
        career: careerList
    } = nameList

    return (
        <React.Fragment>
            <div className="personal-home-container publicFadeIn-500ms">
                <div className="background-img">
                    {backgroundImg && <img src={backgroundImg} alt="backgroundImg"/>}
                </div>
                <div className="focus-button">
                    <FocusButton
                        communityUserId={personalId}
                        hasFocus={focusStatus}
                        flushData={() => {
                            getData()
                        }}
                    />
                </div>
                <div className="personal-home-page-row navigate">
                    <div className="user-basic-info">
                        <div className="avatar">
                            <img src={avatar} alt="avatar"/>
                        </div>
                        <div className="nickname-and-badeg">
                            <div className="nickname">
                                {nickname}
                            </div>
                            <div className="recommend">
                                {recommend ? recommend : "他还没有个性签名"}
                            </div>
                            <div className="badeg">
                                <div>
                                    <span>EXP</span>
                                    <span>{experience}</span>
                                </div>
                                <div>
                                    <span>LV</span>
                                    <span>{level}</span>
                                </div>
                                <div>
                                    {epithet}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="statistic">
                        <div onClick={() => {
                            setModel("fans")
                            setFansAndFocusModal(true)
                        }}>
                            <span>粉丝数</span>
                            <span>{fansNum}</span>
                        </div>
                        <div onClick={() => {
                            setModel("focus")
                            setFansAndFocusModal(true)
                        }}>
                            <span>关注数</span>
                            <span>{focusNum}</span>
                        </div>
                        <div>
                            <span>动态数</span>
                            <span>{communityNum}</span>
                        </div>
                    </div>
                </div>
                <div className="hr"><span>个人情报与活动</span></div>
                <div className="personal-home-page-row">
                    <div className="game-info">
                        {introductionId > 0 ? <React.Fragment>
                            <div className="game-info-main-img">
                                <img src={mainImg} alt="mainImg"/>
                            </div>
                            <div className="game-info-curtain"/>
                            <div className="game-info-basic">
                                {/*introductionId,gameRoleName,*/}
                                {/*server,area,role,race,favoriteCareerId*/}
                                <div className="game-role-name">
                                    {gameRoleName}
                                </div>
                                <div className="race">
                                    <span>{getNameById(raceList, race)}</span>
                                </div>
                                <div className="server-and-area">
                                    <span>{getNameById(serverList, server)}</span>
                                    <span>{getNameById(areaList, area)}</span>
                                </div>
                                <div className="career-and-role">
                                    <img src={getCareerImg(getNameById(careerList,
                                        favoriteCareerId))} alt="careerImg"/>
                                    <img src={roleImgAddress(getNameById(roleList,
                                        role))} alt="roleImg"/>
                                </div>
                                <Button
                                    style={{maxWidth: "6rem"}}
                                    onClick={() => {
                                        history.push(`/main/introduction/details/${personalId}`)
                                    }}
                                >
                                    详情
                                </Button>
                            </div>
                        </React.Fragment> : <div className="empty">
                            该用户已隐藏个人情报信息
                        </div>}
                    </div>
                    <div className="activity-info">
                        {activityList === null && <div className="empty">
                            该用户已隐藏参加过的活动
                        </div>}
                        {activityList?.length > 0 &&
                        <div className="activity-info-label">参加过的活动</div>}
                        <div className="activity-info-group">
                            {activityList?.length === 0 && "暂无"}
                            {activityList?.map((item: { [key: string]: any }) => {
                                const {startTime, endTime, name, id} = item
                                return <div
                                    key={id}
                                    className="activity-info-item"
                                    onClick={() => {
                                        history.push(`/main/activity/details/${id}`)
                                    }}
                                >
                                    <div className="label">
                                        {name}
                                    </div>
                                    <div className="time">
                                        <span>{startTime.split(/\s/)[0]}</span>
                                        <span>{endTime.split(/\s/)[0]}</span>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
                <div className="hr">
                    <span>{`最近${maxCommunityTotal}条动态/评论/回复`}</span>
                </div>
                <div>
                    <AboutCommunity
                        maxTotal={10}
                        userId={personalId}
                        showCommunity={showCommunity}
                        showReply={showReply}
                        showComment={showComment}
                    />
                </div>
            </div>
            <Loading visible={loadingVisible}/>
            <FansAndFocusModal
                model={model}
                visible={fansAndFocusModal}
                setVisible={setFansAndFocusModal}
                userId={personalId}
            />
        </React.Fragment>
    )
}

export default Index;