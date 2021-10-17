import {GoblogApiV1} from "@/config/fetchConfig";

interface getActivityListParams {
    pageSize: number
    pageNum: number
}

export const getActivityList = (data?: getActivityListParams) => {
    return GoblogApiV1.GET("/public/activity/find", data)
}

interface getOneActivityParams {
    activityId: number
    participatorId: number
}

export const getOneActivity = (data?: getOneActivityParams) => {
    return GoblogApiV1.GET("/public/activity/one", data)
}


interface getParticipatorParams {
    participatorId: number
    offset: number
    activityId: number
}

export const getParticipator = (data?: getParticipatorParams) => {
    return GoblogApiV1.GET("/public/activity_participator/find", data)
}

interface addParticipatorParams {
    participatorId: number
    activityId: number
    productionUrl?: number
}

export const addParticipator = (data?: addParticipatorParams) => {
    return GoblogApiV1.POST("/activity_participator/add", data)
}