import {
    PraiseIcon,
    UserInformationIcon,
    IntroductionIcon,
    BuddyIcon
} from "@/assets/icon/iconComponent"

//顶部导航
export const navigateLabelArray = [{
    name: "首页",
    id: 0,
    address: "/main/home"
}, {
    name: "鱼塘",
    id: 1,
    address: "/main/introduction"
}, {
    name: "广场",
    id: 2,
    address: "/main/community"
}, {
    name: "活动",
    id: 3,
    address: "/main/activity"
}]

//个人中心左边导航
export type UserCenterNavigateArray = Array<{
    name: string
    id: number
    isVisible: boolean
    icon: string | (() => JSX.Element)
}>

export const userCenterNavigateArray: UserCenterNavigateArray = [
    {
        name: "基本信息",
        id: 0,
        isVisible: true,
        icon: UserInformationIcon
    },
    {
        name: "粉丝与关注",
        id: 1,
        isVisible: true,
        icon: BuddyIcon
    },
    {
        name: "个人情报",
        id: 2,
        isVisible: true,
        icon: IntroductionIcon
    },
    {
        name: "生成资料卡图片",
        id: 3,
        isVisible: true,
        icon: IntroductionIcon
    },
    {
        name: "最近点赞",
        id: 4,
        isVisible: true,
        icon: PraiseIcon
    },
    {
        name: "个人主页设置",
        id: 5,
        isVisible: true,
        icon: IntroductionIcon
    }
]