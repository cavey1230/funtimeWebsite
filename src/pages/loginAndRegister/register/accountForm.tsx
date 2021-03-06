import React, {useState} from 'react';
import {Form, FormItem} from "@/basicComponent/Form";
import Input from "@/basicComponent/Input";
import Button from "@/basicComponent/Button";
import Radio from "@/basicComponent/Radio";
import RuleModal from "@/pages/loginAndRegister/register/ruleModal";

interface Props {
    stepRef: React.RefObject<any>
    onFinish: (value: any) => {}
}

const AccountForm: React.FC<Props> = (props) => {
    const {onFinish} = props

    const [formRef, setFormRef] = useState("" as any)

    const [modalVisible, setModalVisible] = useState(false)

    return (
        <React.Fragment>
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
                        regexp={new RegExp(/^[A-Za-z0-9]+$/)}
                        matchAll={true}
                        noFocusStyle={true}
                        type="password"
                        initializeValue={""}
                        placeholder={"重复密码"}
                        autocomplete="password text"
                    />
                </FormItem>
                <FormItem
                    label={"rule"}
                    name={"rule"}
                    style={{margin: "2rem 0"}}
                    condition={{
                        required: {value: true, tips: "同意后才能进行一下步操作"},
                    }}
                >
                    <Radio width={"15rem"} alignItems={"center"} size={"small"}>
                        <a href="#" onClick={(event) => {
                            event.preventDefault()
                            setModalVisible(true)
                        }}>同意用户注册协议</a>
                    </Radio>
                </FormItem>
                <FormItem
                    style={{margin: "1rem 0"}}
                >
                    <Button type={"submit"}>下一步</Button>
                </FormItem>
            </Form>
            <RuleModal visible={modalVisible} setVisible={setModalVisible}/>
        </React.Fragment>
    );
};

export default AccountForm;