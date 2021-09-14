import React from 'react';
import useLocalStorage from "@/customHook/useLocalStorage";
import {useHistory} from "react-router-dom";
import {userLoginFunc} from "@/pages/loginAndRegister/login";

const useAutoLogin = () => {
    const [getLocalStorage] = useLocalStorage()

    const history = useHistory()

    const autoLogin = () => {
        const loginTimeStamp = getLocalStorage("loginTime")
        const userInfo = getLocalStorage("userInfo")
        const password = getLocalStorage("password")
        const nowTime = String(new Date())
        const nowTimeStamp = Date.parse(nowTime)
        const distance = loginTimeStamp ? (nowTimeStamp - loginTimeStamp) / 360_0000 : null
        if ((distance && distance >= 3 && password)) {
            userLoginFunc(userInfo.username, password, true, history, 1)
        }
    }

    return autoLogin
};

export default useAutoLogin;