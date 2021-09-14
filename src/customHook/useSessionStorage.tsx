import React from 'react';
import {tuple} from "@/utils/typescriptUtils";

const sessionStorageParam = tuple(
    "noReadNormalMessageNum",
    "noReadImportantMessageNum",
    "noReadNormalMessageDetails",
    "noReadImportantMessageDetails",
);

type GetSessionStorage = (type: typeof sessionStorageParam[number]) => any

const useSessionStorage = () => {
    const getSessionStorage: GetSessionStorage = (type) => {
        if (
            type === "noReadNormalMessageDetails" ||
            type === "noReadImportantMessageDetails"
        ) {
            return JSON.parse(localStorage.getItem(type))
        }
        if (
            type === "noReadNormalMessageNum" ||
            type === "noReadImportantMessageNum"
        ) {
            return Number(localStorage.getItem(type))
        }
    }

    return [getSessionStorage]
};

export default useSessionStorage;