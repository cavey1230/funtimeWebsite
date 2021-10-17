import React from 'react';
import {tuple} from "@/utils/typescriptUtils";

const sessionStorageParam = tuple(
    "verificationWaitTime",
    "socialWaitTime",
    "friendLink",
    "describe",
    "copyright"
);

export type sessionType = typeof sessionStorageParam[number]

type GetSessionStorage = (...type: sessionType[]) => any

type GetSessionStorage2 = (type: sessionType) => any

const useSessionStorage = () => {
    const dealFunc: GetSessionStorage2 = (type) => {
        if (
            type === "verificationWaitTime" ||
            type === "socialWaitTime"
        ) {
            return Number(sessionStorage.getItem(type)) as number
        } else if (
            type === "friendLink" ||
            type === "describe" ||
            type === "copyright"
        ) {
            return JSON.parse(sessionStorage.getItem(type))
        }
    }

    const getSessionStorage: GetSessionStorage = (...type) => {
        if (type.length > 1) {
            return type.map(item => {
                return dealFunc(item)
            })
        } else {
            return dealFunc(type[0])
        }
    }

    return [getSessionStorage]
};

export default useSessionStorage;