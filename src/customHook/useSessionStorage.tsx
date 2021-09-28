import React from 'react';
import {tuple} from "@/utils/typescriptUtils";

const sessionStorageParam = tuple(
    "verificationWaitTime",
    "socialWaitTime"
);

export type sessionType = typeof sessionStorageParam[number]

type GetSessionStorage = (type: sessionType) => any

const useSessionStorage = () => {
    const getSessionStorage: GetSessionStorage = (type) => {
        if (
            type === "verificationWaitTime" ||
            type === "socialWaitTime"
        ) {
            return Number(sessionStorage.getItem(type)) as number
        }
    }

    return [getSessionStorage]
};

export default useSessionStorage;