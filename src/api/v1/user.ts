import {GoblogApiV1} from "@/config/fetchConfig";

interface getUserCountNumberParams {
    userId: number
}

//取得用户粉丝,关注,动态条数
export const getUserCountNumber = (data: getUserCountNumberParams) => {
    return GoblogApiV1.GET("/user/get_count_numbers", data)
}


interface getNoReadMessageParams {
    toUserId: number
}

//未读消息条数
export const getNoReadMessage = (data: getNoReadMessageParams) => {
    return GoblogApiV1.GET("/message/no_read_message", data)
}

interface getUserLevelInfoParams {
    userId: number
}

//未读消息条数
export const getUserLevelInfo = (data: getUserLevelInfoParams) => {
    return GoblogApiV1.GET("/public/level/one", data)
}