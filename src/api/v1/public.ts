import {GoblogApiV1} from "@/utils/fetchApi";

//上传图片
export const upload = (data: any) => {
    return GoblogApiV1.UPLOAD("/upload", data)
}