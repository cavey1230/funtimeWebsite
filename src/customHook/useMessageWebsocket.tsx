import React, {useEffect} from 'react';
import useLocalStorage from "@/customHook/useLocalStorage";
import {useDispatch} from "react-redux";
import {
    updateNoReadImportantMessageDetails,
    updateNoReadImportantMessageNum,
    updateNoReadNormalMessageDetails,
    updateNoReadNormalMessageNum
} from "@/redux/noReadMessageReducer";
import {address, websocketAddress} from "@/config/fetchConfig";

type Data = Array<{ messageType: string, total: number }>

export const useMessageWebsocket = () => {

    const [getLocalStorage] = useLocalStorage()

    const dispatch = useDispatch()

    const arrayToObject = (data: Data) => {
        return data?.reduce((pre, item) => (
            {...pre, [item.messageType]: item.total}
        ), {}) || {}
    }

    const accordingTypeSetState: {
        [key: string]: ((num: number) => void) | ((data: Data) => void)
    } = {
        "user_message_total": (num: number) => {
            localStorage.setItem("noReadNormalMessageNum", String(num))
            dispatch(updateNoReadNormalMessageNum(num))
        },
        "system_message_total": (num: number) => {
            localStorage.setItem("noReadImportantMessageNum", String(num))
            dispatch(updateNoReadImportantMessageNum(num))
        },
        "user_message_details": (data: Array<{ messageType: string, total: number }>) => {
            const innerObject = arrayToObject(data)
            localStorage.setItem("noReadNormalMessageDetails", JSON.stringify(innerObject))
            dispatch(updateNoReadNormalMessageDetails(innerObject))
        },
        "system_messaged_details": (data: Array<{ messageType: string, total: number }>) => {
            const innerObject = arrayToObject(data)
            localStorage.setItem("noReadImportantMessageDetails", JSON.stringify(innerObject))
            dispatch(updateNoReadImportantMessageDetails(innerObject))
        },
    }

    useEffect(() => {
        const userId = getLocalStorage("userId")
        if (!userId) return
        const webSocket = new WebSocket(`${websocketAddress}/public/websocket/link?&id=${userId}`)
        webSocket.onopen = function () {
            console.log("?????????????????????,connected")
        }
        webSocket.onmessage = function (e) {
            const data = JSON.parse(e.data)
            Object.keys(data).forEach((item) => {
                accordingTypeSetState[item](data[item])
            })
        }
        return () => {
            console.log("?????????????????????")
            webSocket.close(1000, "close")
        }
    }, [])

};