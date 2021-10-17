import React, {useEffect, useRef, useState} from 'react';
import Input from "@/basicComponent/Input";
import Button from "@/basicComponent/Button";
import {showToast} from "@/utils/lightToast";
import {editUserNickname} from "@/api/v1/user";
import useLocalStorage from "@/customHook/useLocalStorage";

interface Props {
    globalEditStatus: boolean
    buttonStyle: { [key: string]: string | number }
    onFinish: (value: string, close: (bool: boolean) => void) => void
    initializeData:string
}

const EditNicknameOrRecommend: React.FC<Props> = (props) => {
    const {buttonStyle, globalEditStatus,onFinish,initializeData} = props

    const [visible, setVisible] = useState(false)

    const inputRef = useRef(null)

    useEffect(() => {
        if (!globalEditStatus) {
            setVisible(false)
        }
    }, [globalEditStatus])

    return (
        <React.Fragment>
            {!visible ?
                <span className="nickname">{initializeData}</span> :
                <Input
                    ref={inputRef}
                    width={"30%"}
                    style={{
                        minWidth: "20rem",
                        width: "100%",
                        height: "6rem"
                    }}
                    noFocusStyle={true}
                    placeholder={"请输入"}
                />
            }
            {globalEditStatus && <Button
                style={buttonStyle}
                onClick={() => {
                    setVisible(prevState => !prevState)
                }}
            >
                {visible ? "撤销修改" : "修改"}
            </Button>}
            {visible && <Button
                style={buttonStyle}
                onClick={() => {
                    const value = inputRef.current.value
                    if (!(value.length > 0)) {
                        showToast("空值不能提交", "error")
                        return
                    }
                    onFinish && onFinish(value,setVisible)
                }}
            >
                确认
            </Button>}
        </React.Fragment>
    );
};

export default EditNicknameOrRecommend;