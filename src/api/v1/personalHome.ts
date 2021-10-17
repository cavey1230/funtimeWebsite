import {GoblogApiV1} from "@/config/fetchConfig";

interface getPersonalHomePageDataParams {
    userId: number
    loginUserId: number
}

export const getPersonalHomePageData = (data: getPersonalHomePageDataParams) => {
    return GoblogApiV1.GET("/public/personal_home_page/one", data)
}

interface getPersonalHomePageCommunityParams {
    userId: number
}

export const getPersonalHomePageCommunity = (data: getPersonalHomePageCommunityParams) => {
    return GoblogApiV1.GET("/public/personal_home_page/community", data)
}

interface getPersonalHomeSettingParams {
    userId: number
}

export const getPersonalHomeSetting = (data: getPersonalHomeSettingParams) => {
    return GoblogApiV1.GET("/personal_setting/one", data)
}

interface editPersonalHomeSettingParams {
    id:number
    showGameInfo: number
    showJoinActivity: number
    showCommunity: number
    showComment: number
    showReply: number
    maxCommunityTotal: number
    backgroundImg: string
}

export const editPersonalHomeSetting = (data: editPersonalHomeSettingParams) => {
    const {id,...rest} = data
    return GoblogApiV1.PUT(`/personal_setting/edit/${id}`, rest)
}