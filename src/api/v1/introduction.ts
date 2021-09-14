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
}

export const getIntroductionData = (data: getIntroductionDataParams) => {
    return GoblogApiV1.POST("/public/introduction/list", data)
}

interface createIntroductionLikeParams {
    userId: number,
    introductionId: number
}

export const createIntroductionLike = (data: createIntroductionLikeParams) => {
    return GoblogApiV1.POST("/introduction_like/add", data)
}

interface createIntroductionWatchParams {
    userId: number,
    introductionId: number
}

export const createIntroductionWatch = (data: createIntroductionWatchParams) => {
    return GoblogApiV1.POST("/introduction_watch/add", data)
}