import {GoblogApiV1} from "@/config/fetchConfig";

interface searchDataParams {
    keyword: string
}

//取得搜索内容
export const searchData = (data: searchDataParams) => {
    return GoblogApiV1.GET("/public/search/data", data)
}

interface searchListParams {
    pageNum: number
    pageSize: number
    keyword: string
    indexName: string
}

export const searchList = (data: searchListParams) => {
    return GoblogApiV1.GET("/public/search/list", data)
}