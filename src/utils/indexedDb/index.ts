type CreateTableList = Array<{
    tableName: string,
    keyPath: string,
    indexArray?: Array<{ name: string, keyPath: string, unique: boolean }>
}>

type OnFinish = (result: IDBDatabase) => void

export type ConditionParams = { model: "index" | "all", limit: "one" | "more", index?: string, key?: number | string }

export class CreateIndexedDB {
    private readonly databaseName: string
    private readonly createTableList: CreateTableList

    constructor(
        databaseName: string,
        createTableList: CreateTableList
    ) {
        this.databaseName = databaseName
        this.createTableList = createTableList
        this.createAndOpen()
    }

    private createAndOpen(onFinish?: OnFinish) {
        const request = window.indexedDB.open(this.databaseName);
        request.onsuccess = () => {
            const result = request.result;
            // console.log(`${this.databaseName}数据库链接成功`);
            onFinish ? onFinish(result) : console.log("数据库初始化成功")
        };
        request.onerror = () => {
            console.log(`${this.databaseName}打开失败`);
        };
        request.onupgradeneeded = (event) => {
            const result = (event.target as any).result;
            this.createTableList.forEach(item => {
                const {tableName, keyPath, indexArray} = item
                if (!result.objectStoreNames.contains(tableName)) {
                    const objectStore = result.createObjectStore(tableName, {keyPath: keyPath});
                    indexArray && indexArray.forEach(indexItem => {
                        const {name, keyPath, unique} = indexItem
                        objectStore.createIndex(name, keyPath, {unique});
                    })
                }
            })
        }
    }

    private transaction = (instance: IDBDatabase, tableName: string) => {
        return instance.transaction([tableName], "readwrite").objectStore(tableName)
    }

    public getDbRequest(tableName: string) {
        const getDataAboutCondition = (
            //查询条件
            params:ConditionParams
        ): Promise<Array<any>> => {
            return new Promise((resolve) => {
                this.createAndOpen((instance) => {
                    const {model, limit, index, key} = params
                    new Promise((resolve, reject) => {
                        //取得indexDb事务
                        const request = this.transaction(instance, tableName)
                        const newArr: Array<any> = []
                        let result: IDBIndex | IDBObjectStore | IDBRequest<any>
                        let context: IDBRequest<IDBCursorWithValue>

                        //索引查询
                        result = model === "index" ? request.index(index) : request

                        if (limit === "one") {
                            if (typeof key === "number") {
                                if (key >= 1) {
                                    result = (result as IDBObjectStore | IDBIndex).get(key)
                                }
                            } else {
                                console.error("单条查询的情况下，只允许参数为number类型")
                            }
                            (result as IDBRequest).onsuccess = (event) => {
                                resolve((event.target as any).result)
                            }
                            (result as IDBRequest).onerror = (event) => {
                                reject(event)
                            }
                        } else {
                            context = key ? (result as IDBIndex | IDBObjectStore).openCursor(IDBKeyRange.only(key)) :
                                (result as IDBIndex | IDBObjectStore).openCursor()
                            context.onsuccess = (event) => {
                                const cursor = (event.target as any).result
                                if (cursor) {//如果存在
                                    const stu = cursor.value
                                    newArr.push(stu)
                                    cursor.continue()
                                } else {
                                    resolve(newArr)
                                }
                            }
                            context.onerror = (event) => {
                                reject(event)
                            }
                        }
                    }).then(res => resolve(res as Array<any>))
                })
            })
        }

        const addDataToTable = (data: Array<any>) => {
            this.createAndOpen((instance) => {
                const request = this.transaction(instance, tableName)
                data.forEach(item => {
                    request.put(item)
                })
            })
        }

        return {getDataAboutCondition, addDataToTable}
    }
}