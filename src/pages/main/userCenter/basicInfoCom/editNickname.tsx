import React, {useEffect, useRef, useState} from 'react';
import Input from "@/basicComponent/Input";
import Button from "@/basicComponent/Button";
import {showToast} from "@/utils/lightToast";
import {editUserNickname} from "@/api/v1/user";
import useLocalStorage from "@/customHook/useLocalStorage";

interface Props {
    globalEditStatus: boolean
    buttonStyle: { [key: string]: string | number }
}

const EditNickname: React.FC<Props> = (props) => {
    const {buttonStyle, globalEditStatus} = props

    const [nicknameEditStatus, setNicknameEditStatus] = useState(false)

    const inputRef = useRef(null)

    const [getLocalStorage] = useLocalStorage()

    useEffect(() => {
        if (!globalEditStatus) {
            setNicknameEditStatus(false)
        }
    }, [globalEditStatus])

    const {nickname, id} = getLocalStorage("userInfo")

    return (
        <React.Fragment>
            {!nicknameEditStatus ?
                <span className="nickname">{nickname}</span> :
                <Input
                    ref={inputRef}
                    width={"30%"}
                    style={{
                        minWidth: "9rem",
                        width: "100%",
                        height: "6rem"
                    }}
                    noFocusStyle={true}
                    placeholder={"请输入新昵称"}
                />
            }
            {globalEditStatus && <Button
                style={buttonStyle}
                onClick={() => {
                    setNicknameEditStatus(prevState => !prevState)
                }}
            >
                {nicknameEditStatus ? "撤销修改" : "修改昵称"}
            </Button>}
            {nicknameEditStatus && <Button
                style={buttonStyle}
                onClick={async () => {
                    const newNickname = inputRef.current.value
                    if (!(newNickname.length > 0)) {
                        showToast("空昵称不能提交", "error")
                        return
                    }
                    const result = await editUserNickname({
                        userId: id,
                        nickname: newNickname
                    })
                    if (result.status === 200) {
                        localStorage.setItem("userInfo", JSON.stringify({
                            ...getLocalStorage("userInfo"),
                            nickname: newNickname
                        }))
                        setNicknameEditStatus(false)
                    }
                }}
            >
                确认修改
            </Button>}
        </React.Fragment>
    );
};

export default EditNickname;