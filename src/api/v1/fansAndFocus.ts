//创建关注
import {GoblogApiV1} from "@/config/fetchConfig";


interface createFocusParams {
    followUserId: number
    targetUserId: number
}

export const createFocus = (data: createFocusParams) => {
    return GoblogApiV1.POST("/focus/add", data)
}

interface cancelFocusParams {
    followUserId: number
    targetUserId: number
}

//取消关注
export const cancelFocus = (data: cancelFocusParams) => {
    return GoblogApiV1.GET("/focus/cancel", data)
}

interface hasFocusParams {
    followUserId: number
    targetUserId: number
}

//关注状态
export const hasFocus = (data: hasFocusParams) => {
    return GoblogApiV1.GET("/focus/has_focus", data)
}

interface getListParams {
    pageSize: number
    pageNum: number
    toUserId: number
}

//取得关注列表
export const getFocusList = (data: getListParams) => {
    return GoblogApiV1.GET("/focus/focus_list", data)
}

//取得粉丝列表
export const getFansList = (data: getListParams) => {
    return GoblogApiV1.GET("/focus/fans_list", data)
}