import React, {CSSProperties, forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {CameraIcon} from "@/assets/icon/iconComponent";

import "./Upload.less";

interface Props {
    multiple: boolean
    maxFileLength: number
    acceptFileType: string
    onChange: (value: Array<string>) => void
    initializeFileUrlList: Array<any>
    justifyContent: CSSProperties["justifyContent"]
}

const Upload: React.FC<Partial<Props> & React.RefAttributes<any>> = forwardRef((
    props, ref
) => {
    const {
        multiple, maxFileLength, acceptFileType,
        onChange, initializeFileUrlList, justifyContent,
    } = props

    const fileRef = useRef(null)

    const [fileUrlArray, setFileUrlArray] = useState(initializeFileUrlList || [])

    useEffect(()=>{
        initializeFileUrlList && setFileUrlArray(initializeFileUrlList)
    },[initializeFileUrlList])

    useEffect(() => {
        onChange && onChange(fileUrlArray)
    }, [fileUrlArray])

    useImperativeHandle(ref, () => ({
        clear: () => {
            setFileUrlArray([])
        }
    }))

    const fileChange = () => {
        const files = fileRef.current.files
        const filesLength = files.length
        if (maxFileLength && (fileUrlArray.length + filesLength > maxFileLength)) return
        const fillArray = new Array(filesLength).fill("")
        const getPromise = (item: any, index: number) => {
            return new Promise((resolve) => {
                const reader = new FileReader()
                reader.readAsDataURL(files[index])
                reader.onload = () => {
                    resolve(reader.result)
                }
            })
        }
        const promiseSession = fillArray.map(getPromise)
        Promise.all(promiseSession).then(res => {
            setFileUrlArray([...fileUrlArray, ...res])
        })
    }

    return (
        <div className="upload-container" style={{justifyContent}}>
            <div className="img-presentation">
                {fileUrlArray?.map((item, index) => {
                    return <img
                        key={index}
                        src={item}
                        alt={`img-item-${index}`}
                        onClick={() => {
                            const innerFileUrlArray = fileUrlArray
                            innerFileUrlArray.splice(index, 1)
                            setFileUrlArray([...innerFileUrlArray])
                        }}
                    />
                })}
            </div>
            <div
                className="add-img"
                onClick={() => {
                    fileRef.current.click()
                }}
            >
                <CameraIcon/>
                <div>添加图片</div>
                {maxFileLength && <div>
                    {`${fileUrlArray.length}/${maxFileLength}`}
                </div>}
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
                    accept={acceptFileType}
                    multiple={multiple}
                />
            </div>
        </div>
    );
})


export default Upload;