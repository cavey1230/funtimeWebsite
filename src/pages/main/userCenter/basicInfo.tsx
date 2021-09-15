import React, {useEffect, useState} from 'react';
import useLocalStorage from "@/customHook/useLocalStorage";
import WithLabel from "@/pages/main/userCenter/publicComponent/withLabel";
import FieldsetContainer from "@/pages/main/userCenter/publicComponent/fieldsetContainer";
import Button from "@/basicComponent/Button";
import EditAvatarModal from "@/pages/main/userCenter/basicInfoCom/editAvatarModal";
import Switch from "@/basicComponent/Switch";
import EditNickname from "@/pages/main/userCenter/basicInfoCom/editNickname";

import "./basicInfo.less";

const BasicInfo = () => {
    const [getLocalStorage] = useLocalStorage()

    const [globalEditStatus, setGlobalEditStatus] = useState(false)

    const [editAvatarModalVisible, setEditAvatarModalVisible] = useState(false)

    const buttonStyle = {width: "30%", marginTop: "1rem", minWidth: "9rem"}

    const {avatar, email, verificationStatus} = getLocalStorage("userInfo")

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
                    <WithLabel label={"修改模式"}>
                        <div className="with-label-content-item edit-button-item">
                            <Switch
                                status={globalEditStatus}
                                setStatus={() => {
                                    setGlobalEditStatus(prevState => !prevState)
                                }}
                                labelArray={["是", "否"]}
                            />
                        </div>
                    </WithLabel>
                    <WithLabel label={"头像"}>
                        <div className="with-label-content-item avatar-item">
                            <img src={avatar} alt="avatar"/>
                            {globalEditStatus && <Button
                                style={buttonStyle}
                                onClick={() => {
                                    setEditAvatarModalVisible(true)
                                }}
                            >
                                修改头像
                            </Button>}
                        </div>
                    </WithLabel>
                    <WithLabel label={"昵称"}>
                        <div className="with-label-content-item nickname-item">
                            <EditNickname
                                globalEditStatus={globalEditStatus}
                                buttonStyle={buttonStyle}
                            />
                        </div>
                    </WithLabel>
                </FieldsetContainer>
                <FieldsetContainer title={"账号相关"}>
                    <WithLabel label={"邮箱地址无法更改"}/>
                    <WithLabel label={"邮箱"}>
                        <div className="with-label-content-item email-item">
                            {email}
                        </div>
                    </WithLabel>
                    <WithLabel label={"验证状态"}>
                        <div className="with-label-content-item">
                            {verificationStatus === 1 ? "已验证" : "未验证"}
                        </div>
                    </WithLabel>
                    {verificationStatus === 0 && <WithLabel label={"重新认证"}>
                        <div className="with-label-content-item">
                            <Button style={buttonStyle}>
                                再次邮件
                            </Button>
                        </div>
                    </WithLabel>}
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