import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useHistory, useRouteMatch} from "react-router-dom";
import {searchData, searchList} from "@/api/v1/search";
import {mdParser} from "@/utils/mdParser";
import Button from '@/basicComponent/Button';
import Loading from "@/basicComponent/Loading";

import "./index.less";

type Hits = {
    hits: {
        total: {
            value: number,
        },
        hits: [
            {
                highlight: {
                    [key: string]: any
                },
                _source: {
                    [key: string]: any
                }
            }
        ]
    }
}

type DataType = {
    user: Hits
    comment: Hits
    community: Hits
    reply: Hits
    introduction: Hits
}

type ListType = {
    user: Array<any>
    comment: Array<any>
    community: Array<any>
    reply: Array<any>
    introduction: Array<any>
}

type TotalType = {
    user: number
    comment: number
    community: number
    reply: number
    introduction: number
}

const Index = () => {
    const match = useRouteMatch()

    const keyword = (match.params as any).keyword

    const [list, setList] = useState({} as ListType)

    const [total, setTotal] = useState({} as TotalType)

    const [haveTotal, setHaveTotal] = useState({} as TotalType)

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [pageSize, setPageSize] = useState(10)

    const history = useHistory()

    useEffect(() => {
        getData(keyword)
    }, [])

    const getData = (keyword: string) => {
        setLoadingVisible(true)
        searchData({keyword}).then(res => {
            if (res.status === 200) {
                const result = dealData(res.data)
                const {total, haveTotal, list} = result
                setList(list)
                setHaveTotal(haveTotal)
                setTotal(total)
            }
            setLoadingVisible(false)
        })
    }

    const dealData = (data: any) => {
        const innerData = (data as DataType)
        return Object.keys(innerData).reduce((
            store, item: keyof DataType
        ) => {
            const {total, list} = secondLevelDealData(innerData[item])
            store.total[item] = total
            store.list[item] = list
            store.haveTotal[item] = list?.length
            return store
        }, {
            total: {} as TotalType,
            haveTotal: {} as TotalType,
            list: {} as ListType
        })
    }

    const secondLevelDealData = (dataItem: any) => {
        const total = dataItem.hits.total.value
        const list = dataItem.hits.hits?.map((hitsItem: any) => {
            Object.keys(hitsItem.highlight).forEach(highlightProperty => {
                hitsItem._source.hasOwnProperty(highlightProperty)
                hitsItem._source[highlightProperty] = hitsItem.highlight[highlightProperty]
            })
            return hitsItem._source
        })
        return {total, list}
    }

    const getList = (keyName: keysType) => {
        const haveTotalNum = haveTotal[keyName]
        const allTotalNum = total[keyName]
        const maximumPageNum = Math.ceil(allTotalNum / pageSize)
        const nowPageNum = Math.ceil(haveTotalNum / pageSize)
        setLoadingVisible(true)
        if (maximumPageNum > nowPageNum) {
            searchList({
                pageSize: 10,
                pageNum: nowPageNum + 1,
                keyword: keyword,
                indexName: keyName
            }).then(res => {
                if (res.status === 200) {
                    const result = secondLevelDealData(res.data)
                    const {list: resultList} = result
                    const newArray = list[keyName].concat(resultList)
                    setList({...list, [keyName]: newArray})
                    const newHaveTotal = haveTotal[keyName] + resultList?.length
                    setHaveTotal({...haveTotal, [keyName]: newHaveTotal})
                }
                setLoadingVisible(false)
            })
        }
    }

    const nameForKey = useMemo(() => ({
        user: "搜索到的用户",
        comment: "搜索到的评论",
        community: "搜索到的动态",
        reply: "搜索到的回复",
        introduction: "搜索到的个人情报"
    }), [])

    const nameForDataKey = useMemo(() => ({
        content: "内容",
        nickname: "昵称",
        sns: "社交账号",
        recommend: "个性签名",
        gameRoleName: "游戏名称",
        selfIntroduction: "自我介绍"
    }), [])

    type keysType = keyof typeof nameForKey

    type dataKeysType = keyof typeof nameForDataKey

    const navigateOfKey = useCallback((
        keyName: keysType, keyArray: any
    ) => {
        const {userId, communityId, id, replyToCommentId} = keyArray
        const navigateObj = {
            user: `/main/personal/home/${id}`,
            comment: `/main/details/${communityId}/${id}/0`,
            community: `/main/details/${id}`,
            reply: `/main/details/${communityId}/${replyToCommentId}/${id}`,
            introduction: `/main/introduction/details/${userId}`
        }
        return navigateObj[keyName]
    }, [])

    const renderSearchItem = (arr: Array<any>, keyName: keysType) => {
        const highlightMatchKey = [
            "content", "nickname", "sns",
            "recommend", "gameRoleName", "selfIntroduction"
        ]

        const isExist = (data: string, index: number, keys: string) => {
            return data && <div key={index} className="global-search-item-match">
                <div>{nameForDataKey[keys as dataKeysType]}:</div>
                <div dangerouslySetInnerHTML={{
                    __html: data && mdParser.render(String(data))
                }}/>
            </div>
        }

        const renderSpecial = (keyName: keysType, data: any) => {
            const {avatar, imgArray, mainImg} = data
            const returnImg = (imgArray: Array<string>) => {
                return imgArray?.length > 0 &&
                    <div className="normal-img-container">
                        <img className="normal-img" src={imgArray[0]} alt="avatar"/>
                    </div>
            }
            switch (keyName) {
                case "user":
                    return <img className="avatar" src={avatar} alt="avatar"/>
                case "comment" :
                    return returnImg(imgArray)
                case "community" :
                    return returnImg(imgArray)
                case "reply" :
                    return returnImg(imgArray)
                case "introduction" :
                    return returnImg([mainImg])
            }
        }

        const haveTotalNum = haveTotal[keyName]

        const allTotalNum = total[keyName]

        return <div key={keyName} className="global-search-item">
            <div className="global-search-item-label">
                <span>{nameForKey[keyName as keysType]}</span>
                {haveTotalNum && allTotalNum &&
                <span>{`(${haveTotalNum}/${allTotalNum})`}</span>}
            </div>
            <div className="global-search-item-field-group">
                {arr?.map(item => {
                    const {id, createTime} = item
                    return <div
                        key={id}
                        className="global-search-item-field"
                        onClick={() => {
                            history.push(navigateOfKey(keyName, item))
                        }}
                    >
                        <div className="create-time">
                            <span>创建时间:</span>
                            <div dangerouslySetInnerHTML={{
                                __html: createTime && mdParser.render(String(createTime))
                            }}/>
                        </div>
                        <div>
                            {renderSpecial(keyName, item)}
                        </div>
                        {highlightMatchKey.map((keys, index) => {
                            return isExist(item[keys], index, keys)
                        })}
                    </div>
                })}
            </div>
            {haveTotalNum < allTotalNum && <div>
                <Button onClick={() => {
                    getList(keyName)
                }}>加载更多</Button>
            </div>}
        </div>
    }


    return (
        <React.Fragment>
            <div className="global-search-group">
                {Object.keys(list).map((item: keysType) => {
                    return renderSearchItem(list[item], item)
                })}
            </div>
            <Loading visible={loadingVisible}/>
        </React.Fragment>
    );
};

export default Index;