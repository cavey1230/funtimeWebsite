import React from 'react';
import Navbar from "@/pages/main/navbar";
import {RouterRender} from "@/utils/routerRender";
import {useDispatch} from "react-redux";
import {updateSkinStatus} from "@/redux/skinChangeReducer";
import useSkinStatus from "@/customHook/useSkinStatus";
import {useMessageWebsocket} from "@/customHook/useMessageWebsocket";

import "./index.less";

const Index = () => {
    const [_, skinStatus] = useSkinStatus()

    const dispatch = useDispatch()

    // 链接消息系统
    // 会在短时间内重复获取二次
    // 接收消息类型如下
    // 先是用户的普通消息
    // 再是重要消息
    useMessageWebsocket()

    return (
        <div className={`outermost-container`}>
            <Navbar
                skinStatus={skinStatus}
                setSkinStatus={() => {
                    localStorage.setItem("skinStatus", String(!skinStatus))
                    dispatch(updateSkinStatus({
                        skinStatus: !skinStatus
                    }))
                }}
            />
            <div className="content-container">
                <div className="content-inner-container">
                    <RouterRender type="children"/>
                </div>
            </div>
        </div>
    );
};

export default Index;