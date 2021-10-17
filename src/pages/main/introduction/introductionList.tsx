import React, {useEffect, useState} from 'react';

import {roleImgAddress} from "@/assets/img/returnImgByName";
import {
    SunIcon,
    MoonIcon,
    WatchIcon,
    SolidCollectIcon,
    HollowCollectIcon, HelpIcon
} from '@/assets/icon/iconComponent';
import MoreDropdown from "@/pages/main/publicComponent/moreDropdown";
import useTimeChanger from "@/customHook/useTimeChanger";
import useMessage from '@/customHook/useMessage';
import useLocalStorage from "@/customHook/useLocalStorage";
import {createIntroductionLike} from "@/api/v1/introduction";
import {showToast} from "@/utils/lightToast";
import {useHistory} from "react-router-dom";
import BScroll from "better-scroll";
import Dropdown from "@/basicComponent/Dropdown";

import "./introductionList.less";
import {getCareerImg} from "@/pages/main/introductionDetails/categoryCareer";

interface Props {
    dataList: Array<any>
    nameList: { [key: string]: Array<any> }
    setDataList: (array: Array<any>) => void
    scrollGetData: (callback: () => void) => void
    haveData: boolean
    isMobile: boolean
    condition: { [key: string]: string | number }
}

type addIntroductionProps = (
    loginUserId: number,
    introductionId: number,
    callback: () => void
) => void

export const addIntroductionLike: addIntroductionProps = (
    loginUserId, introductionId, callback
) => {
    createIntroductionLike({
        userId: loginUserId,
        introductionId: introductionId
    }).then(res => {
        if (res.status === 200) {
            showToast("好耶")
            callback()
        }
    })
}

export const getNameById = (list: any[], id: number) => {
    const resultArray = list.length > 0 && list.filter(item => item.id === id)
    return resultArray.length > 0 ? resultArray[0].name : ""
}

export const IntroductionList: React.FC<Props> = (props) => {
    const {
        dataList, nameList, setDataList,condition,
        scrollGetData, haveData, isMobile
    } = props

    const {
        server: serverList,
        area: areaList,
        role: roleList,
        race: raceList,
        career: careerList
    } = nameList

    const [helpVisible, setHelpVisible] = useState(false)

    const [helpVisible2, setHelpVisible2] = useState(false)

    const [helpVisible3, setHelpVisible3] = useState(false)

    const timeChanger = useTimeChanger()

    const [scroll, setScroll] = useState({} as BScroll)

    const sendMessage = useMessage()

    const history = useHistory()

    const [getLocalStorage] = useLocalStorage()

    useEffect(() => {
        const config = isMobile ? {
            scrollY: true,
            pullUpLoad: true,
            mouseWheel: true,
            bounce: {
                top: false,
                bottom: true,
                left: false,
                right: false
            },
            click: true,
        } : {
            pullUpLoad: true,
            scrollY: false,
            click: true,
        }
        setScroll(new BScroll('.introduction-better-scroll', config))
    }, [])

    useEffect(() => {
        let innerGetData: () => void
        const bsIsExist = Object.keys(scroll).length > 0
        if (bsIsExist && isMobile) {
            innerGetData = () => {
                console.log("我到底了")
                scrollGetData(() => {
                    scroll.finishPullUp()
                })
            }
            scroll.on('pullingUp', innerGetData)
            scroll.refresh()
        }
        return () => {
            bsIsExist && isMobile && scroll.off("pullingUp", innerGetData)
        }
    }, [scroll, dataList])

    useEffect(()=>{
        if(Object.keys(scroll).length > 0){
            scroll.scrollTo(0, 0, 0)
            scroll.finishPullUp()
            scroll.refresh()
        }
    },[condition])

    const renderList = (dataList: Array<any>) => {
        return dataList.length > 0 && dataList.map((item, index) => {
            const {
                id, gameRoleName, mainImg, race, updateTime,
                area, role, server, favoriteCareerId,
                normalOnlineTime, selfIntroduction, isSocial,
                watchNum, likeNum, hasLiked, userId
            } = item
            return <div
                key={id}
                className="introduction-list-item"
            >
                <div className="introduction-list-main-img"
                     onClick={() => {
                         history.push(`/main/introduction/details/${userId}`)
                     }}
                >
                    <img src={mainImg} alt="mainImg"/>
                </div>
                {!isMobile && <React.Fragment>
                    <div className="introduction-list-info">
                        <span>{gameRoleName}</span>
                        <div>
                            <span>{normalOnlineTime === "白天" ? <SunIcon/> : <MoonIcon/>}</span>
                            <span>{getNameById(serverList, server)} - {getNameById(areaList, area)}</span>
                            <span>{getNameById(raceList, race)}</span>
                        </div>
                        <span>{selfIntroduction}</span>
                        <div className="more-action">
                            {"更新于" + timeChanger(updateTime)}
                            <MoreDropdown
                                data={{
                                    id, userId,
                                    nickname: "" + getNameById(serverList, server) + "-" +
                                        getNameById(areaList, area) + "-" + gameRoleName,
                                    content: selfIntroduction,
                                    imgArray: mainImg,
                                }}
                                keepHideScrollY={isMobile}
                                targetId={id}
                                contentType={"introduction"}
                                dropdownPosition={"bottomRight"}
                            />
                        </div>
                    </div>
                    {isSocial === 1 && <div className="introduction-list-subscript transformRotate">
                        招募好友中
                    </div>}
                    <div className="introduction-list-subscript action-pad">
                        <div className="look-num">
                            <WatchIcon/>
                            <span>{watchNum}</span>
                        </div>
                        <div className="like-num" onClick={() => {
                            const loginUserId = getLocalStorage("userId")
                            !hasLiked && userId && addIntroductionLike(loginUserId, id, () => {
                                const copyDataArray = dataList
                                const dataItem = dataList[index]
                                const {likeNum} = dataItem
                                copyDataArray.splice(index, 1,
                                    {...dataItem, hasLiked: 1, likeNum: likeNum + 1})
                                setDataList([...copyDataArray])
                                sendMessage({
                                    messageType: "introduction_like",
                                    toUserId: userId
                                })
                            })
                        }}>
                            {hasLiked > 0 ? <SolidCollectIcon/> : <HollowCollectIcon/>}
                            <span>{likeNum}</span>
                        </div>
                    </div>
                </React.Fragment>}
                <div className="introduction-list-subscript top-right">
                    <img src={roleImgAddress(getNameById(roleList, role))} alt="roleIcon"/>
                </div>
                <div className="introduction-list-subscript top-right2">
                    <img src={getCareerImg(getNameById(careerList, favoriteCareerId))} alt="careerIcon"/>
                </div>
            </div>
        })
    }

    return (
        <div
            className="introduction-better-scroll"
            style={{height: !isMobile && "100%"}}
        >
            <div className="introduction-list-container">
                <div
                    className="introduction-help-container"
                    style={{justifyContent: isMobile && "flex-start"}}
                >
                    <Dropdown
                        model={isMobile ? "click" : "hover"}
                        timeDelay={200}
                        position={"bottomLeft"}
                        label={<div className="introduction-help-label">
                            <HelpIcon/>
                            <span>如何创建</span>
                        </div>}
                        setExpandStatus={setHelpVisible}
                        expandStatus={helpVisible}
                    >
                        <div className="introduction-help-content">
                            <div>
                                <ol>
                                    <li>注册</li>
                                    <li>验证邮箱</li>
                                    <li>登录</li>
                                    <li>点击个人中心</li>
                                    <li>填写个人情报</li>
                                    <li>提交个人情报</li>
                                </ol>
                            </div>
                        </div>
                    </Dropdown>
                    <Dropdown
                        model={isMobile ? "click" : "hover"}
                        timeDelay={200}
                        position={"bottomCenter"}
                        label={<div className="introduction-help-label">
                            <HelpIcon/>
                            <span>优先展示规则</span>
                        </div>}
                        setExpandStatus={setHelpVisible2}
                        expandStatus={helpVisible2}
                    >
                        <div className="introduction-help-content">
                            <span>
                                系统会优先展示最近更新的个人情报,
                                所以有新的角色图就毫不犹豫的上传吧,
                                下列情况也视作更新
                            </span>
                            <div>
                                <ol>
                                    <li>修改喜爱职业</li>
                                    <li>修改个人介绍</li>
                                    <li>修改游戏属性</li>
                                    <li>修改种族</li>
                                    <li>修改社交账号</li>
                                </ol>
                            </div>
                        </div>
                    </Dropdown>
                    <Dropdown
                        model={isMobile ? "click" : "hover"}
                        timeDelay={200}
                        position={"bottomCenter"}
                        label={<div className="introduction-help-label">
                            <HelpIcon/>
                            <span>个人情报规则</span>
                        </div>}
                        setExpandStatus={setHelpVisible3}
                        expandStatus={helpVisible3}
                    >
                        <div className="introduction-help-content">
                            <ul>
                                <li>严禁上传<strong>违反法律法规</strong>的任何图片</li>
                                <li>以及和<strong>FF14不相关,或过于裸露</strong>的任何图片</li>
                                <li>以及<strong>二次元浓度过高</strong>的任何图片</li>
                            </ul>
                            <span>
                                最好是真实的游戏内的角色截图(精修也可)。
                                插画,手绘目前不做限制,后续网站正式版本发布后,可能会做限制。
                                一旦违反上述禁止内容,一经发现,永久ban,不给任何修改机会。
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {renderList(dataList)}
                {isMobile && <div className="tips">
                    {!haveData ? "没有更多了" : "加载更多"}
                </div>}
            </div>
        </div>
    )
}