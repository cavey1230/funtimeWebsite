import React from 'react';
import {tuple} from "@/utils/typescriptUtils";

const localStorageParam = tuple(
    "skinStatus",
    "userId",
    "userInfo",
    "loginTime",
    "password",
    "isMobile",
    "topicList",
    "modalIsWheel",
    "currentNavbar",
    "noReadNormalMessageNum",
    "noReadImportantMessageNum",
    "noReadNormalMessageDetails",
    "noReadImportantMessageDetails",
);

type GetLocalStorage = (type: typeof localStorageParam[number]) => any

const useLocalStorage = () => {
    const getLocalStorage: GetLocalStorage = (type) => {
        if (type === "skinStatus" || type === "isMobile") {
            return localStorage.getItem(type) === "true"
        }
        if (
            type === "userInfo" ||
            type === "topicList" ||
            type === "noReadNormalMessageDetails" ||
            type === "noReadImportantMessageDetails"
        ) {
            return JSON.parse(localStorage.getItem(type))
        }
        if (
            type === "loginTime" ||
            type === "userId" ||
            type === "noReadNormalMessageNum" ||
            type === "noReadImportantMessageNum"
        ) {
            return Number(localStorage.getItem(type))
        }
        if (type === "password" || type === "modalIsWheel") {
            return localStorage.getItem(type)
        }
    }

    return [getLocalStorage]
};

export default useLocalStorage;