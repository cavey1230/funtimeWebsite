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

//懒加载
const Community = React.lazy(() => import('@/pages/main/community'));
const CommunityDetails = React.lazy(() => import('@/pages/main/communityDetails'));
const Message = React.lazy(() => import('@/pages/main/message'));
const Introduction = React.lazy(() => import('@/pages/main/introduction'));
const IntroductionDetails = React.lazy(() => import('@/pages/main/introductionDetails'));

//404页面
import Page404 from "@/pages/page404";

//注册登录
import {Login} from "@/pages/loginAndRegister/login";
import Register from "@/pages/loginAndRegister/register";

//验证页
import ActiveAccount from "@/pages/activeAccount";

//修改密码
import ResetPassword from "@/pages/resetPassword";
import Loading from "@/basicComponent/Loading";

type ChangePageTitleParams = (
    Com: (() => JSX.Element) | React.FC,
    titleName: string,
    options?: Partial<{
        keepalive: boolean,
        keepaliveName: string,
        props: { [key: string]: any }
    }>
) => void

//改变页面标题
const changePageTitle: ChangePageTitleParams = (
    Com,
    titleName,
    options
): React.ReactNode => {
    document.title = titleName

    if (options) {
        const {keepalive, props, keepaliveName} = options
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
            render: () => changePageTitle(Home, "主页")
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
            exact:true,
            render: () => changePageTitle(Introduction, "鱼塘", {
                keepalive: true,
                keepaliveName: "鱼塘"
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