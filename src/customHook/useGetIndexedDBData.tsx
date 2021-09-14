import React, {useEffect} from 'react';
import {db_global} from "@/config/indexedDbConfig";
import {ConditionParams} from "@/utils/indexedDb";

const useGetIndexedDbData = (table: {
    tableName: string,
    condition: ConditionParams
}[], callback: (data: any) => void) => {

    const tableArray = Promise.all(table.map(async (item) => {
        const innerTable = db_global.getDbRequest(item.tableName)
        const result = await innerTable.getDataAboutCondition(item.condition)
        return {name: item.tableName, result: result}
    }))

    useEffect(() => {
        tableArray.then(res => {
            const innerObj: { [key: string]: any } = {}
            res.forEach(item => {
                innerObj[item.name] = item.result
            })
            callback(innerObj)
        })
    }, [])
};

export default useGetIndexedDbData;