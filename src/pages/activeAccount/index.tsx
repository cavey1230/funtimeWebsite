import React, {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from "react-router-dom";
import {activeAccount} from "@/api/v1/verify";
import Button from "@/basicComponent/Button";
import useSkinStatus from "@/customHook/useSkinStatus";

import whiteLogo from "@/assets/img/logo-white.png";
import blackLogo from "@/assets/img/logo-black.png";

import "./index.less";

interface Props {
    initializeDelayTime: number
}

const Index: React.FC<Props> = ({initializeDelayTime}) => {

    const [_, skinStatus] = useSkinStatus()

    const match = useRouteMatch()

    const history = useHistory()

    const [activeStatusTips, setActiveStatusTips] = useState("等待激活中")

    const [delay, setDelay] = useState(initializeDelayTime)

    useEffect(() => {
        let [runInterval, clear] = debounceFunc()
        const {userId, code} = match.params as {
            userId: number
            code: string
        }
        activeAccount({userId, code}).then(res => {
            if (res.status === 200) {
                setActiveStatusTips("激活成功")
            } else {
                setActiveStatusTips(res.message)
            }
            runInterval()
        })
        return () => {
            clear()
        }
    }, [])

    useEffect(() => {
        if (delay === 0) {
            navigateTo()
        }
    }, [delay])

    const navigateTo = () => {
        history.replace("/")
    }

    const debounceFunc = () => {
        let intervalId: NodeJS.Timer
        return [() => {
            clearInterval(intervalId)
            intervalId = setInterval(() => {
                setDelay(prevState => {
                    if (prevState > 0) {
                        return prevState - 1
                    }
                })
            }, 1000)
        }, () => {
            clearInterval(intervalId)
        }]
    }

    return (
        <div className="verify-container">
            <div className="center-container">
                <div><img src={skinStatus ? whiteLogo : blackLogo} alt="logo"/></div>
                <div>{delay}秒后跳至首页</div>
                <div>{activeStatusTips}</div>
                <div>
                    <Button onClick={() => {
                        navigateTo()
                    }}>
                        去首页
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Index;