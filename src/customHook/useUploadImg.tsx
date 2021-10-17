import React from 'react';
import {upload} from "@/api/v1/public";

//将base64转换为blob
export const dataURLtoBlob = (dataUrl: string) => {
    let arr = dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}

//将blob转换为file
export const blobToFile = (theBlob: any, fileName: string) => {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

const useUploadImg = () => {
    return (imgArray: string[], callback: (urlArray: string[]) => void) => {
        const regExp = new RegExp(";base64,")
        const promiseList = imgArray?.map(item => {
            return new Promise((resolve, reject) => {
                !(regExp.test(item)) && resolve(item)
                const file = blobToFile(dataURLtoBlob(item), `${Date.now()}.jpeg`);
                const formData = new FormData()
                formData.append("file", file)
                upload(formData).then(res => {
                    res.status === 200 ? resolve(res.url) : reject("error")
                })
            })
        })
        Promise.all(promiseList).then((list: string[]) => {
            (!list.includes("error")) && callback(list)
        })
    }
};

export default useUploadImg;