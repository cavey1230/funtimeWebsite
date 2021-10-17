import React from "react";

import {listItem} from "@/utils/routerRender";

import KeepAlive from "react-activation";

//网站主体
import Main from "@/pages/main";
import Home from "@/pages/main/home"; //首页

// import Community from "@/pages/main/community"; //广场
// import CommunityDetails from "@/pages/main/communityDetails"; //动态详情
// import Message from "@/pages/main/message"; //消息页
// import Introduction from "@/pages/main/introduction";//鱼塘
// import IntroductionDetails from "@/pages/main/introductionDetails";//个人情报
// import UserCenter from "@/pages/main/userCenter";//个人情报
// import Activity from "@/pages/main/activity";//活动
// import ActivityDetails from "@/pages/main/activityDetails";//活动详情
// import ArticleCenter from "@/pages/main/articleCenter";//文章中心
// import Search from "@/pages/main/search";//搜索结果

//懒加载
const Community = React.lazy(() => import('@/pages/main/community'));
const CommunityDetails = React.lazy(() => import('@/pages/main/communityDetails'));
const Message = React.lazy(() => import('@/pages/main/message'));
const Introduction = React.lazy(() => import('@/pages/main/introduction'));
const IntroductionDetails = React.lazy(() => import('@/pages/main/introductionDetails'));
const UserCenter = React.lazy(() => import('@/pages/main/userCenter'));
const Activity = React.lazy(() => import('@/pages/main/activity'));
const ActivityDetails = React.lazy(() => import('@/pages/main/activityDetails'));
const ArticleCenter = React.lazy(() => import('@/pages/main/articleCenter'));
const Search = React.lazy(() => import('@/pages/main/search'));

//404页面
import Page404 from "@/pages/page404";

//注册登录
import {Login} from "@/pages/loginAndRegister/login";
import Register from "@/pages/loginAndRegister/register";

//验证页
import ActiveAccount from "@/pages/activeAccount";

//修改密码
import ResetPassword from "@/pages/resetPassword";

//加载页
import Loading from "@/basicComponent/Loading";

//抽出测试组件
import PersonalHome from "@/pages/main/personalHome";


type ChangePageTitleParams = (
    Com: (() => JSX.Element) | React.FC,
    titleName: string,
    options?: Partial<{
        keepalive: boolean,
        keepaliveName: string,
        props: { [key: string]: any }
        startNew: boolean,
    }>,
) => void

//改变页面标题
const changePageTitle: ChangePageTitleParams = (
    Com,
    titleName,
    options
): React.ReactNode => {
    document.title = titleName

    if (options) {
        const {keepalive, props, keepaliveName, startNew} = options
        startNew && document.body.scrollTo({top: 0})
        if (keepalive) {
            //saveScrollPosition 可保存body滚动条位置
            return <React.Suspense fallback={<Loading visible={true}/>}>
                <KeepAlive
                    saveScrollPosition="screen"
                    name={keepaliveName ? keepaliveName : "normal"}
                    id={window.location.hash}
                >
                    <Com {...props}/>
                </KeepAlive>
            </React.Suspense>
        } else {
            return <React.Suspense fallback={<Loading visible={true}/>}>
                <Com {...props}/>
            </React.Suspense>
        }
    }
    return <Com/>
}

export const routers: listItem[] = [
    {
        path: "/login",
        exact: true,
        render: () => changePageTitle(Login, "登录")
    },
    {
        path: "/test",
        exact: true,
        render: () => changePageTitle(PersonalHome, "测试")
    },
    {
        path: "/register",
        exact: true,
        render: () => changePageTitle(Register, "注册")
    },
    {
        path: "/resetPassword",
        exact: true,
        render: () => changePageTitle(ResetPassword, "修改密码")
    },
    {
        path: "/activeAccount/:userId/:code",
        exact: true,
        render: () => changePageTitle(ActiveAccount, "激活账号", {
            props: {initializeDelayTime: 5}
        })
    },
    {
        path: "/",
        exact: true,
        redirect: "/main/home"
    },
    {
        path: "/main",
        component: Main,
        routes: [{
            path: "/main/home",
            render: () => changePageTitle(Home, "主页", {
                keepalive: true,
                keepaliveName: "主页"
            })
        }, {
            path: "/main/community",
            render: () => changePageTitle(Community, "广场", {
                keepalive: true,
                keepaliveName: "广场"
            })
        }, {
            path: "/main/details/:communityId/:commentId/:replyId",
            exact: true,
            render: () => changePageTitle(CommunityDetails, "动态", {
                keepalive: true,
                keepaliveName: "滚动动态"
            })
        }, {
            path: "/main/details/:communityId",
            render: () => changePageTitle(CommunityDetails, "动态", {
                keepalive: true,
                keepaliveName: "普通动态"
            })
        }, {
            path: "/main/message",
            render: () => changePageTitle(Message, "消息", {
                keepalive: true,
                keepaliveName: "消息"
            })
        }, {
            path: "/main/introduction/details/:userId",
            exact: true,
            render: () => changePageTitle(IntroductionDetails, "个人情报", {
                keepalive: true,
                keepaliveName: "个人情报"
            })
        }, {
            path: "/main/introduction",
            exact: true,
            render: () => changePageTitle(Introduction, "鱼塘", {
                keepalive: true,
                keepaliveName: "鱼塘"
            })
        }, {
            path: "/main/activity",
            exact: true,
            render: () => changePageTitle(Activity, "活动", {
                keepalive: true,
                keepaliveName: "活动"
            })
        }, {
            path: "/main/personal/home/:userId",
            exact: true,
            render: () => changePageTitle(PersonalHome, "个人主页", {
                keepalive: true,
                keepaliveName: "个人主页"
            })
        }, {
            path: "/main/search/:keyword",
            exact: true,
            render: () => changePageTitle(Search, "搜索结果", {
                keepalive: true,
                keepaliveName: "搜索结果"
            })
        }, {
            path: "/main/activity/details/:activityId",
            exact: true,
            render: () => changePageTitle(ActivityDetails, "活动详情", {
                keepalive: true,
                keepaliveName: "活动详情"
            })
        }, {
            path: "/main/userCenter/:id",
            exact: true,
            render: () => changePageTitle(UserCenter, "个人中心", {
                keepalive: true,
                keepaliveName: "个人中心"
            })
        }, {
            path: "/main/articleCenter/:userId",
            exact: true,
            render: () => changePageTitle(ArticleCenter, "文章中心", {
                keepalive: true,
                keepaliveName: "文章中心"
            })
        }, {
            redirect: "/404"
        }]
    },
    {
        path: "/404",
        render: () => changePageTitle(Page404, "404")
    },
    {
        render: () => changePageTitle(Page404, "404")
    }
]