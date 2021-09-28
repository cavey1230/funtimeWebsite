import React, { useRef, useState} from 'react';
import WithLabel from "@/pages/main/userCenter/publicComponent/withLabel";
import Button from "@/basicComponent/Button";
import {sendVerifyEmail} from "@/api/v1/verify";
import {showToast} from "@/utils/lightToast";
import Input from "@/basicComponent/Input";
import Loading from "@/basicComponent/Loading";
import {useHistory} from "react-router-dom";
import useWaitTime from "@/customHook/useWaitTime";

interface Props {
    email: string
    verificationStatus: number
    buttonStyle: { [key: string]: any }
    userId: number
}

const AboutAccount: React.FC<Props> = (props) => {
    const {email,verificationStatus, buttonStyle, userId} = props

    const [loadingVisible, setLoadingVisible] = useState(false)

    const inputRef = useRef(null)

    const history = useHistory()

    const [waitTime,setWaitTime] = useWaitTime("verificationWaitTime")

    return (
        <React.Fragment>
            {verificationStatus === 0 && <WithLabel label={"重新认证"}>
                    <Button
                        style={buttonStyle}
                        onClick={() => {
                            if (waitTime <= 0) {
                                setLoadingVisible(true)
                                sendVerifyEmail({email}).then(() => {
                                    showToast("发送成功")
                                    setWaitTime(120)
                                    setLoadingVisible(false)
                                })
                            }
                        }}
                    >
                        发送验证码{waitTime > 0 && `(${waitTime}s后可再发送)`}
                    </Button>
            </WithLabel>}
            {verificationStatus === 0 && <WithLabel label={"激活"}>
                    <Input
                        width={"30%"}
                        style={{
                            minWidth: "20rem",
                            width: "100%",
                            height: "3rem"
                        }}
                        ref={inputRef}
                        placeholder={"区分大小写"}
                        noFocusStyle={true}
                    />
                    <Button
                        style={buttonStyle}
                        onClick={() => {
                            const value = inputRef.current.value
                            if (!value || value.length !== 4) {
                                showToast("验证码为空,或不为4位", "error")
                                return
                            }
                            history.push(`/activeAccount/${userId}/${value}`)
                        }}
                    >
                        点我激活
                    </Button>
            </WithLabel>}
            <Loading visible={loadingVisible}/>
        </React.Fragment>
    );
};

export default AboutAccount;