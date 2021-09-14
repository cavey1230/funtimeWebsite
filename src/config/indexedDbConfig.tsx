import {CreateIndexedDB} from "@/utils/indexedDb";

//公共数据加载(区服信息，种族信息，个人情报身份)
//indexedDb比localstorage更适合缓存结构型数据
export const db_global = new CreateIndexedDB("global", [{
    tableName: "server",
    keyPath: "id",
    indexArray: [{
        name: "name",
        keyPath: "name",
        unique: true
    }, {
        name: "model",
        keyPath: "model",
        unique: false
    }]
}, {
    tableName: "area",
    keyPath: "id",
    indexArray: [{
        name: "name",
        keyPath: "name",
        unique: true
    }, {
        name: "model",
        keyPath: "model",
        unique: false
    }, {
        name: "serverId",
        keyPath: "serverId",
        unique: false
    }]
}, {
    tableName: "career",
    keyPath: "id",
    indexArray: [{
        name: "firstCategory",
        keyPath: "firstCategory",
        unique: false
    }, {
        name: "secondCategory",
        keyPath: "secondCategory",
        unique: false
    }]
}, {
    tableName: "property",
    keyPath: "id"

}, {
    tableName: "race",
    keyPath: "id"

}, {
    tableName: "role",
    keyPath: "id"
}])