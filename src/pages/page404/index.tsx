import React from 'react';

import useSkinStatus from "@/customHook/useSkinStatus";
import {useHistory} from "react-router-dom";

import blackLogo from "@/assets/img/logo-black.png";
import whiteLogo from "@/assets/img/logo-white.png";

import "./index.less";

const Index = () => {

    const [_, skinStatus] = useSkinStatus()

    const history = useHistory()

    const navigateTo = (address: string) => {
        history.replace(address)
    }

    return (
        <div className={`out-404-container`}>
            <div className="center-404-container">
                <div><img src={skinStatus ? whiteLogo : blackLogo} alt="logo"/></div>
                <div>404</div>
                <div>欢乐时光,</div>
                <div>却快乐不起来</div>
                <div>
                    <div onClick={() => navigateTo("/")}>去首页</div>
                    <div onClick={() => navigateTo("/main/introduction")}>去鱼塘</div>
                </div>
            </div>
        </div>
    );
};

export default Index;