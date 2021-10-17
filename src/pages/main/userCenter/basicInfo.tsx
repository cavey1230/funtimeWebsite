import React, {useEffect, useState} from 'react';
import useLocalStorage from "@/customHook/useLocalStorage";
import WithLabel from "@/pages/main/userCenter/publicComponent/withLabel";
import FieldsetContainer from "@/pages/main/userCenter/publicComponent/fieldsetContainer";
import Button from "@/basicComponent/Button";
import EditAvatarModal from "@/pages/main/userCenter/basicInfoCom/editAvatarModal";
import Switch from "@/basicComponent/Switch";
import EditNicknameOrRecommend from "@/pages/main/userCenter/basicInfoCom/editNicknameOrRecommend";
import AboutAccount from "@/pages/main/userCenter/basicInfoCom/aboutAccount";
import {useHistory} from "react-router-dom";
import {editUserNickname, editUserRecommend} from "@/api/v1/user";
import {confirm} from "@/basicComponent/Confirm";

import "./basicInfo.less";

const BasicInfo = () => {
    const [getLocalStorage] = useLocalStorage()

    const [globalEditStatus, setGlobalEditStatus] = useState(false)

    const [editAvatarModalVisible, setEditAvatarModalVisible] = useState(false)

    const history = useHistory()

    const buttonStyle = {width: "30%", marginTop: "1rem", minWidth: "9rem"}

    const {
        avatar, email, verificationStatus,
        nickname, recommend, id
    } = getLocalStorage("userInfo")

    useEffect(() => {
        if (!globalEditStatus) {
            setEditAvatarModalVisible(false)
        }
    }, [globalEditStatus])

    return (
        <React.Fragment>
            <div className="user-center-basic-info-container">
                <FieldsetContainer title={"个人资料"}>
                    <WithLabel label={"更改头像或昵称会消耗1500点经验值"}/>
                    <WithLabel label={"修改模式"} alignItems={"flex-end"}>
                        <Switch
                            status={globalEditStatus}
                            setStatus={() => {
                                setGlobalEditStatus(prevState => !prevState)
                            }}
                            labelArray={["是", "否"]}
                        />
                    </WithLabel>
                    <WithLabel label={"头像"} expandClassName={"avatar-item"}>
                        <img src={avatar} alt="avatar"/>
                        {globalEditStatus && <Button
                            style={buttonStyle}
                            onClick={() => {
                                setEditAvatarModalVisible(true)
                            }}
                        >
                            修改头像
                        </Button>}
                    </WithLabel>
                    <WithLabel label={"昵称"} expandClassName={"nickname-item"}>
                        <EditNicknameOrRecommend
                            globalEditStatus={globalEditStatus}
                            buttonStyle={buttonStyle}
                            initializeData={nickname}
                            onFinish={(value, close) => {
                                confirm({
                                    title: "提示",
                                    content: "修改提交后需重新登录账号",
                                    onClickText: "确认提交",
                                    onClick: async () => {
                                        const result = await editUserNickname({
                                            userId: id,
                                            nickname: value
                                        })
                                        if (result.status === 200) {
                                            localStorage.setItem("userInfo", JSON.stringify({
                                                ...getLocalStorage("userInfo"),
                                                nickname: value
                                            }))
                                            close(false)
                                            history.push("/login")
                                        }
                                    }
                                })
                            }}
                        />
                    </WithLabel>
                    <WithLabel label={"个性签名"} expandClassName={"recommend-item"}>
                        <EditNicknameOrRecommend
                            globalEditStatus={globalEditStatus}
                            buttonStyle={buttonStyle}
                            initializeData={recommend}
                            onFinish={(value, close) => {
                                confirm({
                                    title: "提示",
                                    content: "修改提交后需重新登录账号",
                                    onClickText: "确认提交",
                                    onClick: async () => {
                                        const result = await editUserRecommend({
                                            userId: id,
                                            recommend: value
                                        })
                                        if (result.status === 200) {
                                            localStorage.setItem("userInfo", JSON.stringify({
                                                ...getLocalStorage("userInfo"),
                                                recommend: value
                                            }))
                                            close(false)
                                            history.push("/login")
                                        }
                                    }
                                })
                            }}
                        />
                    </WithLabel>
                </FieldsetContainer>
                <FieldsetContainer title={"状态相关"}>
                    <WithLabel label={"邮箱地址无法更改"}/>
                    <WithLabel label={"邮箱"} expandClassName={"email-item"}>
                        {email}
                    </WithLabel>
                    <WithLabel label={"验证状态"}>
                        {verificationStatus === 1 ? "已验证" : "未验证"}
                    </WithLabel>
                    <AboutAccount
                        email={email}
                        verificationStatus={verificationStatus}
                        buttonStyle={buttonStyle}
                        userId={id}
                    />
                </FieldsetContainer>
                <FieldsetContainer title={"修改密码"}>
                    <WithLabel label={"修改密码"} expandClassName={"email-item"}>
                        <Button
                            style={buttonStyle}
                            onClick={() => {
                                history.push("/resetPassword")
                            }}
                        >
                            去修改
                        </Button>
                    </WithLabel>
                </FieldsetContainer>
            </div>
            <EditAvatarModal
                height={"30rem"}
                width={"30rem"}
                setVisible={setEditAvatarModalVisible}
                visible={editAvatarModalVisible}
            />
        </React.Fragment>
    );
};

export default BasicInfo;