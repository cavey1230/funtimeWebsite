import {GoblogApiV1} from "@/config/fetchConfig";

interface getReasonListParams {
    reportBannedType: string
}

//新增话题
export const getReasonList = (data: getReasonListParams) => {
    return GoblogApiV1.GET("/banned/reason_list", data)
}

interface createBannedLogParams {
    type: string
    targetId: number
    commitUserId: number
    reason: string
    customReason: string
}

//新增话题
export const createBannedLog = (data: createBannedLogParams) => {
    return GoblogApiV1.POST("/banned/add_log", data)
}