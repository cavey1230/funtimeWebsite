import React, {useState} from 'react';
import {ConditionParams} from "@/utils/indexedDb";
import useGetIndexedDbData from "@/customHook/useGetIndexedDBData";

const useGetNameList = () => {
    const [nameList, setNameList] = useState({
        server: [],
        area: [],
        role: [],
        race: [],
        career: [],
        property: []
    })

    const publicIndexedDBCondition: ConditionParams = {model: "all", limit: "more"}

    useGetIndexedDbData(Object.keys(nameList).map((item) => {
        return {tableName: item, condition: publicIndexedDBCondition}
    }), (result) => {
        setNameList(result)
    })

    return nameList
};

export default useGetNameList;