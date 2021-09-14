import React, {useCallback, useEffect, useState} from 'react';
import {Tab} from "@/basicComponent/Tab";
import Search from "@/basicComponent/Search";
import classnames from '@/utils/classnames';
import Input from "@/basicComponent/Input";

import "./searchPad.less";

interface Props {
    nameList: {
        server: Array<any>,
        area: Array<any>,
        role: Array<any>,
        race: Array<any>,
        career: Array<any>
    }
    onFinish: (result: any) => void
}


export const weekDescriberChange = (data: Array<any>, dayName: string[]) => {
    const length = data.length
    const maxIndex = Math.max(...data)
    const minIndex = Math.min(...data)
    const maxDay = dayName[maxIndex]
    if (length === 5 && maxIndex === 4) {
        return "工作日"
    } else if (length === 2 && minIndex === 5 && maxIndex === 6) {
        return "双休"
    } else if (length === 7) {
        return "一整周"
    } else {
        return maxDay ? "最晚" + maxDay : ""
    }
}

export const SearchPad: React.FC<Props> = (props) => {

    const {nameList, onFinish} = props

    const [idCollection, setIdCollection] = useState({
        server: 0,
        area: 0,
        role: 0,
        race: 0,
        favoriteCareerId: 0,
    })

    const [conditionLabel, setConditionLabel] = useState({
        server: "",
        area: "",
        role: "",
        race: "",
        favoriteCareerId: "",
        normalOnlineTime: "",
        preciseOnlineTime: "",
        gameRoleName: ""
    })

    type keyOfIdCollection = keyof typeof idCollection

    const [selectTabId, setSelectTabId] = useState(0)

    const [selectWeek, setSelectWeek] = useState([] as number[])

    const [innerAreaNameList, setInnerAreaNameList] = useState([])

    const labelArr = useCallback(() => {
        const innerArray = [
            "服务器", "大区", "身份", "种族", "喜爱职业",
            "日在线时间", "周在线时间", "游戏角色名"
        ]
        return innerArray.map((item, index) => ({
            title: item, id: index + 1
        }))
    }, [])

    const setConditionLabelOrIdWithKey = (key: string, data: string | number, model: "id" | "label") => {
        model === "label" ? setConditionLabel({...conditionLabel, [key]: data}) :
            setIdCollection({...idCollection, [key]: data})
    }

    /*
    *indexedDB的数据获取为异步，所以第一次传入的Props为无效的数据
    *需在effect重新设置一次
    */
    useEffect(() => {
        setConditionLabelOrIdWithKey("area", "", "label")
        idCollection.server === 0 ? setInnerAreaNameList(nameList.area) :
            setInnerAreaNameList(nameList.area.filter(item => item.serverId === idCollection.server))
    }, [idCollection.server, nameList.area])

    const renderNameItem = (data: Array<any>, key: string) => {
        return <div className="search-pad-content-group">
            {data?.map(item => {
                const {id, name} = item
                return <div
                    key={id}
                    className="search-pad-content-item"
                    onClick={() => {
                        setConditionLabelOrIdWithKey(key, name, "label")
                        key !== "normalOnlineTime"
                        && key !== "preciseOnlineTime"
                        && key !== "gameRoleName"
                        && setConditionLabelOrIdWithKey(key, id, "id")
                    }}
                    children={name}
                />
            })}
        </div>
    }

    const renderWeekSelect = () => {
        const dayName = ["星期一", "星期二", "星期三", "星期四", "星期五", "周六", "周日"]
        return <div className="search-pad-content-group">
            {dayName.map((item, index) => {
                return <div
                    key={index}
                    className={classnames(
                        "search-pad-content-item",
                        {"search-pad-content-week-selected": selectWeek.includes(index)}
                    )}
                    onClick={() => {
                        const copySelectWeek = [...selectWeek]
                        const indexOf = copySelectWeek.indexOf(index)
                        if (indexOf >= 0) {
                            copySelectWeek.splice(indexOf, 1)
                        } else {
                            copySelectWeek.push(index)
                        }
                        setSelectWeek(copySelectWeek.sort((a, b) => a - b))
                        setConditionLabelOrIdWithKey(
                            "preciseOnlineTime",
                            weekDescriberChange(copySelectWeek, dayName),
                            "label")
                    }}
                >
                    {item}
                </div>
            })}
        </div>
    }

    const searchKeyArray = ["server", "area", "role", "race", "career"];

    const searchItemComponentList = [...searchKeyArray.map((item) => {
        return renderNameItem(
            item === "area" ? innerAreaNameList : nameList[item as keyof typeof nameList],
            item === "career" ? "favoriteCareerId" : item
        )
    }), renderNameItem([{name: "白天", id: 0}, {name: "晚上", id: 1}], "normalOnlineTime")]

    return (<Search
        isReverse={false}
        data={conditionLabel}
        setCondition={(obj) => {
            !obj["server"] && setConditionLabelOrIdWithKey("server", 0, "id")
            setConditionLabel(obj)
        }}
        onFinish={(data) => {
            Object.keys(idCollection).forEach(item => {
                if (!data[item]) {
                    idCollection[item as keyOfIdCollection] = 0
                }
            })
            onFinish && onFinish({
                ...conditionLabel,
                ...idCollection,
                preciseOnlineTime: "[" + String(selectWeek.map(item => item + 1)) + "]"
            })
        }}
    >
        <Tab
            labelArr={labelArr()}
            onChange={(selectTopicId) => {
                setSelectTabId(selectTopicId)
            }}
            initializeSelectId={1}
            blockDisplay={true}
            allowScroll={true}
        >
            <div
                id={String(selectTabId)}
                className="search-pad-content-container"
            >
                {selectTabId < 7 && searchItemComponentList[selectTabId - 1]}
                {selectTabId === 7 && renderWeekSelect()}
                {selectTabId === 8 && <Input
                    width={"100%"}
                    noFocusStyle={true}
                    initializeValue={conditionLabel.gameRoleName}
                    placeholder={"请输入游戏角色名"}
                    style={{width: "50%", margin: "2rem 0"}}
                    onChange={(value) => {
                        setConditionLabelOrIdWithKey("gameRoleName", value, "label")
                    }}
                />}
            </div>
        </Tab>
    </Search>)
}