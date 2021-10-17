import React, {useRef, useState} from 'react';
import {Form, FormItem} from "@/basicComponent/Form";
import Crop from "@/basicComponent/Crop";
import Input from "@/basicComponent/Input";
import Button from "@/basicComponent/Button";
import {showToast} from "@/utils/lightToast";

interface Props {
    stepRef: React.RefObject<any>
    onFinish: (value: any) => void
}

const AvatarForm: React.FC<Props> = (props) => {
    const {stepRef, onFinish} = props

    const [formRef, setFormRef] = useState("" as any)

    const [timestamp, setTimestamp] = useState(0)

    const [imgSrc, setImgSrc] = useState("" as any)

    const fileRef = useRef(null)

    const cropRef = useRef(null)

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

    const innerOnFinish = (value: { [key: string]: string }) => {
        const file = cropRef.current.getFile()
        if (!file) {
            showToast("请选择头像后再提交", "error")
            return
        }
        onFinish({...value, file})
    }

    return (
        <React.Fragment>
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
                <div
                    className="avatar-form-container"
                    onClick={() => {
                        fileRef.current.click()
                    }}
                >
                    <Button>上传图片</Button>
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
            </div>
            <Form
                onFinish={innerOnFinish}
                ref={(el) => setFormRef(el)}
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
                    label={"nickname"}
                    name={"nickname"}
                    style={{margin: "2rem 0"}}
                    condition={{
                        required: {value: true, tips: "此选项为必填值"},
                        max: {value: 6, tips: "昵称最大不能超过6位数"},
                        min: {value: 2, tips: "昵称最小为2位数"},
                    }}
                >
                    <Input
                        matchAll={true}
                        noFocusStyle={true}
                        initializeValue={""}
                        placeholder={"昵称"}
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
                    <Button type={"submit"}>下一步</Button>
                </FormItem>
            </Form>
        </React.Fragment>

    );
};

export default AvatarForm;