import React, {useState} from 'react';
import Dropdown from "@/basicComponent/Dropdown";
import useLocalStorage from "@/customHook/useLocalStorage";
import {useHistory} from "react-router-dom";
import {confirm} from "@/basicComponent/Confirm";
import {getUserCountNumber, getUserLevelInfo} from "@/api/v1/user";
import Badeg from "@/basicComponent/Badeg";
import Loading from "@/basicComponent/Loading";
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";
import {useAliveController} from "react-activation";
import {GoblogApiV1} from "@/config/fetchConfig";

import "./userAcitonBar.less";

interface Props {
    isMobile?: boolean
}

const UserActionBar: React.FC<Props> = (props) => {
    const [expand, setExpand] = useState(false)

    const [getLocalStorage] = useLocalStorage()

    const userId = getLocalStorage("userId")

    const userInfo = getLocalStorage("userInfo")

    const history = useHistory()

    const {clear} = useAliveController()

    const {noReadNormalMessageNum, noReadImportantMessageNum} = useSelector((state: ReduxRootType) => {
        return state.noReadMessageReducer
    })

    const clearLocalStorage = () => {
        const copySkinStatus = getLocalStorage("skinStatus")
        const copyIsMobile = getLocalStorage("isMobile")
        localStorage.clear()
        localStorage.setItem("skinStatus", copySkinStatus)
        localStorage.setItem("isMobile", copyIsMobile)
    }

    const {avatar, nickname, verificationStatus} = userInfo ? userInfo : {
        avatar: "",
        nickname: "状态异常,请联系管理员",
        verificationStatus: 0
    }

    return (
        <React.Fragment>
            {!userId ? <div className="login-and-register-button">
                <span onClick={() => {
                    history.push("/login")
                }}>登录</span>
                <span className="rods">/</span>
                <span onClick={() => {
                    history.push("/register")
                }}>注册</span>
            </div> : <div className="user-info-out-container">
                <Dropdown
                    model="click"
                    expandStatus={expand}
                    setExpandStatus={setExpand}
                    onClick={() => {
                        setExpand(true)
                    }}
                    position="bottomRight"
                    label={<div className="user-info-container">
                        <Badeg targetNum={noReadNormalMessageNum + noReadImportantMessageNum} badegSize={"middle"}>
                            <img src={avatar} alt="avatar"/>
                        </Badeg>
                        <span>{nickname}</span>
                    </div>}>
                    <div className="user-info-navbar-container">
                        <div className="navigate big-avatar">
                            <img onClick={() => {
                                history.push(`/main/personal/home/${userId}`)
                            }} src={avatar} alt="avatar"/>
                            <div>{nickname}</div>
                            <div className="small-font-size">{verificationStatus > 0 ? "已验证邮箱" : "未验证邮箱"}</div>
                        </div>
                        <div className="navigate navigate-router" onClick={() => {
                            history.push("/main/userCenter/0")
                            setTimeout(() => {
                                setExpand(false)
                            }, 0)
                        }}>
                            个人中心
                        </div>
                        <div className="navigate navigate-router" onClick={() => {
                            history.push("/main/articleCenter/" + userId)
                            setTimeout(() => {
                                setExpand(false)
                            }, 0)
                        }}>
                            文章中心
                        </div>
                        <div className="navigate navigate-router" onClick={() => {
                            history.push("/main/message")
                            setTimeout(() => {
                                setExpand(false)
                            }, 0)
                        }}>
                            <Badeg
                                targetNum={noReadNormalMessageNum + noReadImportantMessageNum}
                                left={"110%"}
                                top={"0"}
                            >
                                消息中心
                            </Badeg>
                        </div>
                        <div className="navigate navigate-router"
                             onClick={(event) => {
                                 event.stopPropagation()
                                 confirm({
                                     title: "登出",
                                     content: "确认登出",
                                     onClick: () => {
                                         clearLocalStorage()
                                         history.push("/login")
                                         GoblogApiV1.setToken("")
                                         setTimeout(() => {
                                             clear()
                                         }, 500)
                                     }
                                 })
                             }}
                        >
                            登出
                        </div>
                    </div>
                </Dropdown>
            </div>}
        </React.Fragment>
    );
}

export default UserActionBar;