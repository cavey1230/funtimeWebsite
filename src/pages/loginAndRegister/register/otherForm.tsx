import React, {useState} from 'react';
import {Form, FormItem} from "@/basicComponent/Form";
import Input from "@/basicComponent/Input";
import Verification from "@/pages/loginAndRegister/verification";
import Button from "@/basicComponent/Button";
import {showToast} from "@/utils/lightToast";

interface Props {
    stepRef: React.RefObject<any>
    onFinish: (value: any) => void
}

const OtherForm: React.FC<Props> = (props) => {

    const {stepRef, onFinish} = props

    const [isVerify, setIsVerify] = useState(false)

    const [formRef, setFormRef] = useState("" as any)

    const innerOnFinish = (value: { [key: string]: string }) => {
        if (!isVerify) {
            showToast("请验证后再提交", "error")
            return
        }
        onFinish(value)
    }

    return (
        <Form
            onFinish={innerOnFinish}
            ref={(el) => setFormRef(el)}
        >
            <FormItem
                label={"whereToLearn"}
                name={"whereToLearn"}
                style={{margin: "2rem 0"}}
            >
                <Input noFocusStyle={true} initializeValue={""} placeholder={"何处了解到本站(选填)"}/>
            </FormItem>
            <FormItem
                label={"inviteCode"}
                name={"inviteCode"}
                style={{margin: "2rem 0"}}
            >
                <Input noFocusStyle={true} initializeValue={""} placeholder={"邀请码(选填)"}/>
            </FormItem>
            <FormItem>
                <div>
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
                <Button type={"submit"}>注册</Button>
            </FormItem>
        </Form>
    );
}

export default OtherForm;