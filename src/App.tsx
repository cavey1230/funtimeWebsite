import React, {useEffect} from "react";
import {bindEffect, init, RouterRender} from "./utils/routerRender";
import {RouteComponentProps, withRouter} from "react-router-dom";
import useSkinStatus from "@/customHook/useSkinStatus";
import useWindowResize from "@/customHook/useWindowResize";
import useAutoLogin from "@/customHook/useAutoLogin";
import useInitializeIndexDb from "@/customHook/useInitializeIndexDB";
import useShortcutKey from "@/customHook/useShortcutKey";
import { useDisableIosScale } from "./customHook/useIosDisableScale";

import "@/assets/reset.css";
import "@/assets/publicAnimation.less";
import "./App.less";

const App: React.FC<RouteComponentProps> = () => {
    // 皮肤
    const [skinStatusClassName] = useSkinStatus()

    // 自动登录
    const autoLogin = useAutoLogin()

    // 客户端类型判断 手机 PC
    useWindowResize()

    // 注册快捷键
    useShortcutKey()

    // 禁止ios 缩放
    useDisableIosScale()

    useEffect(() => {
        console.log("---------", skinStatusClassName, "------------------")
    }, [skinStatusClassName])

    //indexedDB挂载初始数据(异步)
    useInitializeIndexDb()

    useEffect(() => {
        // 每次应用发送重绘时，重置路由，然后再执行后续操作
        // 每次redux更新，根组件会重新渲染，这样就会导致短时间内重复渲染多次
        // console.log("我被重新执行了")
        init()
        autoLogin()
        document.body.className = skinStatusClassName
    })

    return (<RouterRender type="root"/>);
}

//bindEffect location改变时强制刷新整个页面
export default withRouter(bindEffect(App))
