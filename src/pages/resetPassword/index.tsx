import React, {useRef, useState} from 'react';
import LayoutContainer from "@/basicComponent/LayoutContainer";
import Step from "@/basicComponent/Step";
import Input from '@/basicComponent/Input';
import {Form, FormItem} from "@/basicComponent/Form";
import Button from "@/basicComponent/Button";
import {showToast} from "@/utils/lightToast";
import {resetPassword, sendVerifyEmail} from "@/api/v1/verify";
import {useHistory} from "react-router-dom";

const Index = () => {
    const [loadingVisible, setLoadingVisible] = useState(false)

    const [userId, setUserId] = useState(0)

    const history = useHistory()

    const stepRef = useRef(null)

    const [stepArray, setStepArray] = useState([{
        name: "验证邮箱",
        id: 0,
        index: 1,
        status: 0
    }, {
        name: "提交修改",
        id: 1,
        index: 2,
        status: 0
    }])

    const emailOnFinish = async (value: any) => {
        const {warning, email} = value
        const copyStepArray = [...stepArray]
        const messageArr = [
            "表单信息未填写完整"
        ]
        if (warning) {
            copyStepArray[0].status = 0
            setStepArray(copyStepArray)
            showToast(messageArr[0], "error")
        } else {
            setLoadingVisible(true)
            const result = await sendVerifyEmail({email})
            setLoadingVisible(false)
            if (result.status === 200) {
                if (result.userId > 0) {
                    setUserId(result.userId)
                    copyStepArray[0].status = 1
                    setStepArray(copyStepArray)
                    stepRef.current.addSelectId()
                }
            }
        }
    }

    const passwordOnFinish = async (value: any) => {
        const {warning, password, rePassword, code} = value
        const messageArr = [
            "两次密码不一致",
            "表单信息未填写完整",
        ]
        if (password !== rePassword) {
            showToast(messageArr[0], "error")
            return
        }
        if (warning) {
            showToast(messageArr[1], "error")
        } else {
            setLoadingVisible(true)
            const result = await resetPassword({
                userId, password, code
            })
            setLoadingVisible(false)
            if (result.status === 200) {
                showToast("修改密码成功，请重新登录,2秒后将自动跳转")
                setTimeout(() => {
                    history.replace("/login")
                }, 2000)
            }
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
                    <Form
                        onFinish={emailOnFinish}
                    >
                        <FormItem
                            label={"email"}
                            name={"email"}
                            style={{margin: "2rem 0"}}
                            condition={{
                                required: {value: true, tips: "此选项为必填值"},
                                email: {value: "@", tips: "邮件格式错误"},
                            }}
                        >
                            <Input
                                noFocusStyle={true}
                                initializeValue={""}
                                placeholder={"邮箱"}
                            />
                        </FormItem>
                        <FormItem
                            style={{margin: "1rem 0"}}
                        >
                            <Button type={"submit"}>下一步</Button>
                        </FormItem>
                    </Form>
                </div>
                <div id="1">
                    <Form
                        onFinish={passwordOnFinish}
                    >
                        <FormItem
                            label={"code"}
                            name={"code"}
                            style={{margin: "2rem 0"}}
                            condition={{
                                required: {value: true, tips: "此选项为必填值"},
                                length: {value: 4, tips: "验证码为4位数"}
                            }}
                        >
                            <Input
                                noFocusStyle={true}
                                initializeValue={""}
                                placeholder={"验证码"}
                            />
                        </FormItem>
                        <FormItem
                            label={"password"}
                            name={"password"}
                            style={{margin: "2rem 0"}}
                            condition={{
                                required: {value: true, tips: "此选项为必填值"},
                                password: {value: [8, 15], tips: "密码必须包括，大小写字母，和数字"},
                                max: {value: 15, tips: "密码最大不能超过15位数"},
                                min: {value: 8, tips: "密码最小为8位数"},
                            }}
                        >
                            <Input
                                noFocusStyle={true}
                                type="password"
                                initializeValue={""}
                                placeholder={"密码"}
                                autocomplete="password text"
                            />
                        </FormItem>
                        <FormItem
                            label={"rePassword"}
                            name={"rePassword"}
                            style={{margin: "2rem 0"}}
                            condition={{
                                required: {value: true, tips: "此选项为必填值"},
                                password: {value: [8, 15], tips: "密码必须包括，大小写字母，和数字"},
                                max: {value: 15, tips: "密码最大不能超过15位数"},
                                min: {value: 8, tips: "密码最小为8位数"},
                            }}
                        >
                            <Input
                                noFocusStyle={true}
                                type="password"
                                initializeValue={""}
                                placeholder={"重复密码"}
                                autocomplete="password text"
                            />
                        </FormItem>
                        <FormItem style={{margin: "1rem 0"}}>
                            {/*包裹一层 让组件获取ref*/}
                            <div>
                                <Button onClick={() => {
                                    stepRef.current.minusSelectId()
                                }}>
                                    上一步
                                </Button>
                            </div>
                        </FormItem>
                        <FormItem
                            style={{margin: "1rem 0"}}
                        >
                            <Button type={"submit"}>确认</Button>
                        </FormItem>
                    </Form>
                </div>
            </Step>
        </LayoutContainer>
    );
};

export default Index;