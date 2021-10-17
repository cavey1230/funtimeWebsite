import {GoblogApiV1} from "@/config/fetchConfig";


interface getIntroductionDataParams {
    userId?: number,
    loginUserId?: number,
    pageSize: number,
    pageNum: number,
    gameRoleName?: string,
    role?: number,
    race?: number,
    favoriteCareerId?: number,
    server?: number,
    area?: number,
    normalOnlineTime?: string,
    preciseOnlineTime?: string
    visible?: number
}

export const getIntroductionData = (data: getIntroductionDataParams) => {
    return GoblogApiV1.POST("/public/introduction/list", data)
}

interface createAndUpdateIntroductionDataParams {
    role: number
    race: number
    favoriteCareerId: number
    careerIdArray: Array<number>
    imgArray: Array<string>
    mainImg: string
    server: number
    normalOnlineTime: string,
    preciseOnlineTime: Array<number>
    area: number
    gameRoleName: string,
    sns: string,
    selfIntroduction: string,
    propertyIdArray: Array<number>
    propertyRangeArray: Array<number>
    isVisible: number
    isSocial: number
    userId: number
}

export const createAndUpdateIntroductionData = (data: createAndUpdateIntroductionDataParams) => {
    return GoblogApiV1.POST("/introduction/add_and_update", data)
}

interface getOneIntroductionParams {
    userId: number
}

export const getOneIntroduction = (data: getOneIntroductionParams) => {
    return GoblogApiV1.GET("/introduction/one", data)
}

interface createIntroductionLikeParams {
    userId: number,
    introductionId: number
}

export const createIntroductionLike = (data: createIntroductionLikeParams) => {
    return GoblogApiV1.POST("/introduction_like/add", data)
}

interface findIntroductionLikeParams {
    userId: number,
}

export const findIntroductionLike = (data: findIntroductionLikeParams) => {
    return GoblogApiV1.GET("/introduction_like/list", data)
}

interface createIntroductionWatchParams {
    userId: number,
    introductionId: number
}

export const createIntroductionWatch = (data: createIntroductionWatchParams) => {
    return GoblogApiV1.POST("/introduction_watch/add", data)
}

interface createSocialLogParams {
    fromId: number,
    targetId: number,
    requestType: "relationship" | "together"
}

export const createSocialLog = (data: createSocialLogParams) => {
    return GoblogApiV1.POST("/social_log/add", data)
}