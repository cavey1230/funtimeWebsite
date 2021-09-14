import {GoblogApiV1} from "@/config/fetchConfig";

//上传图片
export const upload = (data: any) => {
    return GoblogApiV1.UPLOAD("/upload", data)
}

//游戏区服
export const getServerName = () => {
    return GoblogApiV1.GET("/public/servername/find")
}

//字典
export const getDictionary = () => {
    return GoblogApiV1.GET("/public/dictionary/find")
}