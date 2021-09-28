import {GoblogApiV1} from "@/config/fetchConfig";

interface createTopicParams {
    name: string
    isOutdated: number
    type: string
}

//新增话题
export const createTopic = (data: createTopicParams) => {
    return GoblogApiV1.POST("/topic/add", data)
}

interface getTopicListParams {
    name?: string
    isOutdated: string
    type: string
}

//取得话题
export const getTopicList = (data: getTopicListParams) => {
    return GoblogApiV1.GET("/public/topic/list", data)
}

interface createCommunityParam {
    userId: number,
    content: string,
    imgArray: string[],
    topicId: number,
    isHeightOrderModel: number
}

//新增动态
export const createCommunity = (data: createCommunityParam) => {
    return GoblogApiV1.POST("/community/add", data)
}

export interface getCommunityListParams {
    content?: string
    topicId: number
    userId?: number
    pageSize: number
    pageNum: number
    loginUserId?: number

    [key: string]: string | number
}

//取得话题下所有数据
export const getCommunityList = (data: getCommunityListParams) => {
    return GoblogApiV1.GET("/public/community/list", data)
}

interface getOneCommunityParams {
    id: number
    loginUserId?: number
}

//取得单个话题
export const getOneCommunity = (data: getOneCommunityParams) => {
    return GoblogApiV1.GET("/public/community/one", data)
}

interface createCommentParam {
    "content": string
    "communityId": number
    "commenterId": number
    "imgArray"?: Array<string>
}

//新增评论
export const createComment = (data: createCommentParam) => {
    return GoblogApiV1.POST("/comment/add", data)
}

interface getCommentListParams {
    communityId: number
    pageSize: number
    pageNum: number
}

//取得动态下所有评论
export const getCommentList = (data: getCommentListParams) => {
    return GoblogApiV1.GET("/public/comment/find", data)
}

interface getOneCommentParams {
    id: number
}

//取得单个评论
export const getOneComment = (data: getOneCommentParams) => {
    return GoblogApiV1.GET("/public/comment/one", data)
}

interface getCommentPageNumParams {
    id: number
    communityId: number
    pageSize: number
}

//取得单个评论
export const getCommentPageNum = (data: getCommentPageNumParams) => {
    return GoblogApiV1.GET("/public/comment/page_num", data)
}

interface createReplyParam {
    content: string
    communityId: number
    replierId: number,
    replyToCommentId: number
    referId?: number
    imgArray?: Array<string>
}

//新增回复
export const createReply = (data: createReplyParam) => {
    return GoblogApiV1.POST("/reply/add", data)
}

interface getReplyListParams {
    communityId: number
    replyToCommentId: number
    pageSize: number
    pageNum: number
}

//取得动态下所有评论
export const getReplyList = (data: getReplyListParams) => {
    return GoblogApiV1.GET("/public/reply/find", data)
}

interface getReplyPageNumParams {
    id: number
    communityId: number
    commentId: number
    pageSize: number
}

//取得单个评论
export const getReplyPageNum = (data: getReplyPageNumParams) => {
    return GoblogApiV1.GET("/public/reply/page_num", data)
}

interface createCommunityLikeParams {
    userId: number
    communityId: number
    communityUserId: number
    likeGroupId?: number
    alias?: string
    topicId?: number
}

//创建动态被喜欢数据库记录
export const createCommunityLike = (data: createCommunityLikeParams) => {
    return GoblogApiV1.POST("/community_like/add", data)
}

interface findCommunityLikeParams {
    userId: number
    pageSize: number
    pageNum: number
}

//取得最近喜欢的列表
export const findCommunityLike = (data: findCommunityLikeParams) => {
    return GoblogApiV1.GET("/community_like/list", data)
}

interface createCommunityWatchParams {
    userId: number
    communityId: number
    topicId?: number
}

//创建动态被喜欢数据库记录
export const createCommunityWatch = (data: createCommunityWatchParams) => {
    return GoblogApiV1.POST("/community_watch/add", data)
}