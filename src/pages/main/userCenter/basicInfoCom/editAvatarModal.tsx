import React, {useRef, useState} from 'react';
import {showToast} from "@/utils/lightToast";
import Crop from "@/basicComponent/Crop";
import Button from "@/basicComponent/Button";
import Modal from "@/basicComponent/Modal";
import {editUserAvatar} from "@/api/v1/user";
import useLocalStorage from "@/customHook/useLocalStorage";
import {upload} from "@/api/v1/public";

interface Props {
    visible: boolean
    setVisible: (bool: boolean) => void
    width: string
    height: string
}

const EditAvatarModal: React.FC<Props> = (props) => {

    const {visible, setVisible, width, height} = props

    const cropRef = useRef(null)

    const fileRef = useRef(null)

    const [timestamp, setTimestamp] = useState(0)

    const [getLocalStorage] = useLocalStorage()

    const [imgSrc, setImgSrc] = useState("" as string | ArrayBuffer)

    const fileChange = () => {
        const files = fileRef.current.files

        const verificationPicFile = (file: any) => {
            let fileSize = 0;
            const fileMaxSize = 1024;//1M
            if (file) {
                fileSize = file.size;
                const size = fileSize / 1024;
                if (size > fileMaxSize) {
                    showToast("文件大小不能大于1M！", "error");
                    return false;
                } else if (size <= 0) {
                    showToast("文件大小不能为0M！", "error");
                    return false;
                }
            } else {
                return false;
            }
            return true
        }

        if (files[0]) {
            if (!verificationPicFile(files[0])) return
            const reader = new FileReader()
            reader.readAsDataURL(files[0])
            reader.onloadend = () => {
                const result = reader.result
                setImgSrc(result)
                setTimestamp(Date.now())
            }
        }
    }

    return (
        <Modal
            width={width}
            height={height}
            visible={visible}
            onClose={() => {
                setVisible(false)
            }}
        >
            <div>
                <Crop
                    ref={cropRef}
                    imgSrc={imgSrc}
                    timestamp={timestamp}
                    cropImgWidth={"150px"}
                    cropImgHeight={"150px"}
                    onFinish={(data) => {
                        console.log(data)
                    }}
                />
                <div onClick={() => {
                    fileRef.current.click()
                }}>
                    <Button style={{marginTop: "2rem"}}>
                        上传图片
                    </Button>
                    <input
                        type="file"
                        style={{display: "none"}}
                        ref={fileRef}
                        onClick={() => {
                            fileRef.current.value = ""
                        }}
                        onChange={() => {
                            fileChange()
                        }}
                        accept={"image/png,image/jpeg"}
                    />
                </div>
                <div>
                    <Button
                        style={{marginTop: "2rem"}}
                        onClick={async () => {
                            const file = cropRef.current.getFile()
                            if (!file) {
                                showToast("空图像不能提交", "error")
                                return
                            }
                            const formData = new FormData()
                            formData.append("file", file)
                            const uploadResult = await upload(formData)
                            if (uploadResult.status === 200) {
                                const editResult = await editUserAvatar({
                                    userId: getLocalStorage("userId"),
                                    avatar: uploadResult.url
                                })
                                if (editResult.status === 200) {
                                    showToast("修改成功")
                                    localStorage.setItem("userInfo", JSON.stringify({
                                        ...getLocalStorage("userInfo"),
                                        avatar: uploadResult.url
                                    }))
                                    setVisible(false)
                                }
                            }
                        }}
                    >
                        确认修改
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EditAvatarModal;