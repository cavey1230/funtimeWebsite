import React, {useEffect, useState} from 'react';
import {Form, FormItem} from '@/basicComponent/Form';
import {RouteComponentProps, useHistory} from "react-router-dom";

import Input from '@/basicComponent/Input';
import {showToast} from '@/utils/lightToast';
import Verification from './verification';
import Button from '@/basicComponent/Button';
import {SLink} from '@/utils/routerRender';
import {userLogin} from "@/api/v1/loginAndRegister";
import LayoutContainer from "@/basicComponent/LayoutContainer";
import Radio from "@/basicComponent/Radio";
import {confirm} from "@/basicComponent/Confirm";
import {useAliveController} from "react-activation";

import "./login.less";

export const userLoginFunc = (
    account: string, password: string, isRemember: boolean,
    history: RouteComponentProps["history"], isAutoLogin: number = 0,
    setLoadingVisible?: (bool: boolean) => void
) => {
    userLogin({username: account, password, isAutoLogin}).then(res => {
        if (res.status === 200) {
            const userInfo = res.userInfo
            const userId = res.userInfo.id
            const token = res.token
            const timeStamp = String(new Date())
            if (isRemember) {
                localStorage.setItem("password", password)
            }
            localStorage.setItem("userId", userId)
            localStorage.setItem("loginTime", String(Date.parse(timeStamp)))
            localStorage.setItem("userInfo", JSON.stringify(userInfo))
            localStorage.setItem("token", token)
            setLoadingVisible && setLoadingVisible(false)
            history.goBack()
        } else {
            setLoadingVisible && setLoadingVisible(false)
        }
    })
}

export const Login = () => {

    const [isVerify, setIsVerify] = useState(false)

    const [isRemember, setIsRemember] = useState(false)

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [formRef, setFormRef] = useState("" as any)

    const history = useHistory()

    const {clear} = useAliveController()

    const regexp = new RegExp(/[A-Za-z0-9]+/)

    //清除页面缓存
    useEffect(() => {
        clear()
    }, [])

    const onFinish = (value: any) => {
        const {warning, account, password} = value
        if (!isVerify) {
            showToast("请先验证后再提交", "error")
            return
        }
        if (warning) {
            showToast("表单信息未填写完整，无法提交", "error")
        } else {
            setLoadingVisible(true)
            userLoginFunc(account, password, isRemember, history, 0, setLoadingVisible)
        }
    }

    return (
        <LayoutContainer
            backgroundTips={true}
            loadingVisible={loadingVisible}
        >
            <Form
                onFinish={onFinish}
                ref={(el) => setFormRef(el)}
            >
                <FormItem
                    label={"account"}
                    name={"account"}
                    style={{margin: "0 0 2rem 0"}}
                    condition={{
                        required: {value: true, tips: "此选项为必填值"},
                        max: {value: 10, tips: "最大不能超过10位数"},
                        min: {value: 6, tips: "最小为6位数"},
                    }}
                >
                    <Input
                        regexp={new RegExp(/^[A-Za-z0-9]+$/)}
                        matchAll={true}
                        noFocusStyle={true}
                        initializeValue={""}
                        placeholder={"账号"}
                        autocomplete="username text"
                    />
                </FormItem>
                <FormItem
                    label={"password"}
                    name={"password"}
                    style={{margin: "2rem 0"}}
                    condition={{
                        required: {value: true, tips: "此选项为必填值"},
                        max: {value: 15, tips: "最大不能超过15位数"},
                        min: {value: 8, tips: "最小为8位数"},
                    }}
                >
                    <Input
                        regexp={new RegExp(/^[A-Za-z0-9]+$/)}
                        matchAll={true}
                        noFocusStyle={true}
                        type="password"
                        initializeValue={""}
                        placeholder={"密码"}
                        autocomplete="password text"
                    />
                </FormItem>
                <FormItem
                    label={"verification"}
                    name={"verification"}
                >
                    {/*外面包裹一层让FormItem获取到ref*/}
                    <div className="login-verification">
                        <Verification
                            width={"100%"}
                            height={"4rem"}
                            successCallBack={() => {
                                setIsVerify(true)
                            }}
                            status={isVerify}
                        />
                    </div>
                </FormItem>
                <FormItem
                    style={{margin: "1rem 0"}}
                >
                    <Button type={"submit"}>登录</Button>
                </FormItem>
            </Form>
            <div className="login-action-container">
                <span><Radio onChange={(bool) => {
                    bool && confirm({
                        title: "提示",
                        content: "该功能会明文存储密码至本地localStorage，不建议使用",
                        onClick: () => {
                            setIsRemember(bool as boolean)
                        },
                        onCancel: () => {
                        },
                        onClickText: "确认",
                        onCancelText: "取消"
                    })
                }} width={"100%"} alignItems={"center"} size={"small"}>
                    记住我
                </Radio></span>
                <span>没有账号?<SLink to={"/register"}>去注册</SLink></span>
                <span><SLink to={"/resetPassword"}>忘记密码?</SLink></span>
            </div>
        </LayoutContainer>
    );
};