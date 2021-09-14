import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";

const useSkinStatus = (): [string, boolean] => {
    const [skinStatusClassName, setSkinStatusClassName] = useState("skin-white")

    const skinStatus = useSelector((state: ReduxRootType) => {
        return state.skinChangeReducer.skinStatus
    })

    useEffect(() => {
        //再变更样式类名
        setSkinStatusClassName(skinStatus ? "skin-black" : "skin-white")
    }, [skinStatus])

    return [skinStatusClassName, skinStatus]
};

export default useSkinStatus;