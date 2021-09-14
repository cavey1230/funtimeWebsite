import {GoblogApiV1} from "@/config/fetchConfig";

export interface createMessageParams {
    communityId?: number
    replyId?: number
    commentId?: number
    messageType: "like" | "reply" | "comment" | "introduction_like" | "replyToReply"
    fromUserId?: number
    toUserId: number
    topicId?: number
    targetId?: number
}

//创建消息推送
export const createMessage = (data: createMessageParams) => {
    return GoblogApiV1.POST("/message/add", data)
}

export interface getAllMessageParams {
    toUserId: number
    pageSize: number
    pageNum: number
    messageType?: string
}

//取得所有消息
export const getAllMessage = (data: getAllMessageParams) => {
    return GoblogApiV1.GET("/message/list", data)
}

export interface getAllImportantMessageParams {
    toUserId: number
    pageSize: number
    pageNum: number
    messageType?: string
}

//取得所有消息
export const getAllImportantMessage = (data: getAllImportantMessageParams) => {
    return GoblogApiV1.GET("/important_message/list", data)
}

//删除单条消息
export const deleteMessage = (id: number) => {
    return GoblogApiV1.DELETE(`/message/${id}`)
}

interface deleteAllMessageParams {
    userId: number
}

//删除所有消息
export const deleteAllMessage = (data: deleteAllMessageParams) => {
    return GoblogApiV1.GET("/message/delete_all", data)
}

interface getNoReadMessageParams {
    toUserId: number
}

//取得所有未读的消息条数
export const getNoReadMessage = (data: getNoReadMessageParams) => {
    return GoblogApiV1.GET("/message/no_read_message", data)
}

interface deleteImportantMessageParams {
    importantMessageId: number
    toUserId: number
}

//删除单条消息
export const deleteImportantMessage = (data:deleteImportantMessageParams) => {
    return GoblogApiV1.POST("/important_message/delete",data)
}
