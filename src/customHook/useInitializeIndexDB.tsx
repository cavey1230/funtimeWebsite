import React, {useEffect} from 'react';
import {db_global} from "@/config/indexedDbConfig";
import {getDictionary, getServerName} from "@/api/v1/public";

type serverAndAreaItem = {
    server: { [key: string]: string | number },
    areas: { [key: string]: string | number }[]
}

const useInitializeIndexDb = () => {
    useEffect(() => {
        //取得区服信息
        getServerName().then(res => {
            if (res.status === 200) {
                const serverArray: Array<any> = []
                const areaArray: Array<any> = []
                res.data?.forEach((item: serverAndAreaItem) => {
                    serverArray.push(item.server)
                    item.areas.forEach(area => {
                        areaArray.push(area)
                    })
                })
                const server_name_table = db_global.getDbRequest("server")
                const area_name_table = db_global.getDbRequest("area")
                server_name_table.addDataToTable(serverArray)
                area_name_table.addDataToTable(areaArray)
            }
        })
        //取得个人情报字典
        getDictionary().then(res => {
            if (res.status === 200) {
                const tableName = ["career", "property", "race", "role"]
                tableName.forEach(item => {
                    const innerTable = db_global.getDbRequest(item)
                    innerTable.addDataToTable(res.data[item])
                })
            }
        })
    }, [])
};

export default useInitializeIndexDb;