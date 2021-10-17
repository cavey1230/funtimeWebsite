import {GoblogApiV1} from "@/config/fetchConfig";

export const getHomePageData = () => {
    return GoblogApiV1.GET("/public/home_setting/one")
}

export const getNominateCommunity = () => {
    return GoblogApiV1.GET("/public/home_setting/nominate_community")
}

export const getNominateUser = () => {
    return GoblogApiV1.GET("/public/home_setting/nominate_user")
}

interface getNoticeListParams {
    pageSize: number
    pageNum: number
    settingType: string
}

export const getHomeSettingList = (data: getNoticeListParams) => {
    return GoblogApiV1.GET("/public/home_setting/list", data)
}