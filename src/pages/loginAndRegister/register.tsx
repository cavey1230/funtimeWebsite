import React, {useEffect, useRef, useState} from 'react';

import {showToast} from "@/utils/lightToast";
import {createUser, userLogin} from "@/api/v1/loginAndRegister";
import {checkEmail, checkUsername} from "@/api/v1/verify";
import LayoutContainer from "@/basicComponent/LayoutContainer";
import Step from "@/basicComponent/Step";
import {upload} from "@/api/v1/public";
import {useHistory} from "react-router-dom";
import {SLink} from "@/utils/routerRender";
import {confirm} from "@/basicComponent/Confirm";
import {useAliveController} from "react-activation";

import AccountForm from "@/pages/loginAndRegister/register/accountForm";
import AvatarForm from "@/pages/loginAndRegister/register/avatarForm";
import OtherForm from "@/pages/loginAndRegister/register/otherForm";

import "./register.less";
import {editUserAvatar} from "@/api/v1/user";

const Register = () => {

    const [loadingVisible, setLoadingVisible] = useState(false)

    const stepRef = useRef(null)

    const [stepArray, setStepArray] = useState([{
        name: "账号密码",
        id: 0,
        index: 1,
        status: 0
    }, {
        name: "选择头像",
        id: 1,
        index: 2,
        status: 0
    }, {
        name: "选填部分",
        id: 2,
        index: 3,
        status: 0
    },])

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        whereToLearn: "",
        verificationStatus: 0,
        role: 2,
        nickname: "",
        inviteCode: "",
        file: "" as any
    })

    const history = useHistory()

    const {clear} = useAliveController()

    //清除页面缓存
    useEffect(() => {
        clear()
    }, [])

    const registerAccount = async (value: any) => {
        const {warning, password, rePassword, account} = value
        const copyStepArray = [...stepArray]
        const messageArr = [
            "两次密码不一致",
            "表单信息未填写完整",
        ]
        if (password !== rePassword) {
            showToast(messageArr[0], "error")
            return
        }
        if (warning) {
            copyStepArray[0].status = 0
            setStepArray(copyStepArray)
            showToast(messageArr[1], "error")
        } else {
            const result = await checkUsername({username: account})
            if (result.status === 200) {
                if (result.userId > 0) {
                    showToast("用户名已存在", "error")
                    return
                }
            }
            copyStepArray[0].status = 1
            setStepArray(copyStepArray)
            setFormData({
                ...formData, ...{
                    username: account,
                    password: password,
                }
            })
            stepRef.current.addSelectId()
        }
    }

    const registerAvatar = async (value: any) => {
        const {warning, email, nickname, file} = value
        const copyStepArray = [...stepArray]
        const messageArr = [
            "表单信息未填写完整"
        ]
        if (warning) {
            copyStepArray[1].status = 0
            setStepArray(copyStepArray)
            showToast(messageArr[0], "error")
        } else {
            const result = await checkEmail({email: email})
            if (result.status === 200) {
                if (result.result > 0) {
                    showToast("邮箱已被使用", "error")
                    return
                }
            }
            confirm({
                title: "提示",
                content: "请确保邮箱的有效性，注册时系统会给当前邮箱，发送一封包含验证码的邮件。用来激活账号",
                onClick: () => {
                    copyStepArray[1].status = 1
                    setStepArray(copyStepArray)
                    setFormData({
                        ...formData, ...{
                            email, nickname, file
                        }
                    })
                    stepRef.current.addSelectId()
                },
                onCancel: () => null,
                onClickText: "确认",
                onCancelText: "取消",
            })
        }
    }

    //为了保护上传接口不被滥用，先注册再修改头像
    const registerOther = async (value: any) => {
        const {whereToLearn, inviteCode} = value
        const newFormData = {...formData, ...{whereToLearn, inviteCode}}
        setLoadingVisible(true)
        //先创建用户
        const result = await createUser(newFormData)
        if (result.status === 200) {
            const {username, password} = newFormData
            //再登录
            const loginResult = await userLogin({username, password, isAutoLogin: 0})
            if (loginResult.status === 200) {
                const userInfo = loginResult.userInfo
                const token = loginResult.token
                const userId = loginResult.userInfo.id
                //先存储一次storage调用后面需要token的修改头像接口
                localStorage.setItem("userId", userId)
                localStorage.setItem("userInfo", JSON.stringify(userInfo))
                localStorage.setItem("token", token)
                const timeStamp = String(new Date())
                localStorage.setItem("loginTime", String(Date.parse(timeStamp)))
                //设置定时器，确保fetch能读到sessionStorage中的信息
                setTimeout(async () => {
                    //创建FormData对象
                    const fileFormData = new FormData()
                    fileFormData.append("file", formData.file)
                    const fileResult = await upload(fileFormData)
                    if (fileResult.status === 200) {
                        const avatarAddress = fileResult.url
                        const avatarObj = {userId, avatar: avatarAddress}
                        const editResult = await editUserAvatar(avatarObj)
                        if (editResult.status === 200) {
                            const copyUserInfo = {...userInfo}
                            copyUserInfo.avatar = avatarAddress
                            localStorage.setItem("userInfo", JSON.stringify(copyUserInfo))
                            setLoadingVisible(false)
                            history.replace("/")
                        } else {
                            setLoadingVisible(false)
                            showToast("注册失败", "error")
                        }
                    } else {
                        showToast("头像上传失败", "error")
                        setLoadingVisible(false)
                    }
                }, 100)
            } else {
                showToast("自动登录失败", "error")
                setLoadingVisible(false)
            }
        } else {
            showToast("注册失败", "error")
            setLoadingVisible(false)
        }
    }

    return (
        <LayoutContainer
            loadingVisible={loadingVisible}
        >
            <Step
                initializeSelectId={0}
                stepLabelArray={stepArray}
                labelItemSize={{
                    height: "6rem",
                    width: "6rem"
                }}
                ref={stepRef}
            >
                <div id="0">
                    <AccountForm stepRef={stepRef} onFinish={registerAccount}/>
                </div>
                <div id="1">
                    <AvatarForm stepRef={stepRef} onFinish={registerAvatar}/>
                </div>
                <div id="2">
                    <OtherForm stepRef={stepRef} onFinish={registerOther}/>
                </div>
            </Step>
            <div className="register-action-container">
                <span>已有账号?<SLink to={"/login"}>去登录</SLink></span>
            </div>
        </LayoutContainer>
    );
};

export default Register;