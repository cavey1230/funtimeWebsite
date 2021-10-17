import React, {useEffect, useRef, useState} from 'react';
import CommunityItem from "@/pages/main/community/communityItem";

import "./waterfall.less";
import BScroll from "better-scroll";

interface Props {
    options: {
        columns: number,
        columns_gap: string
    }
    dataArray: Array<any>
    //改变父组件的data 内容，这里改变喜欢数
    setData: (data: any) => void
    getData: (
        callback: () => void
    ) => void
    selectTopicId: number
    condition: Array<any>
    haveData: boolean
    isMobile: boolean
}

export const Waterfall: React.FC<Props> = (props) => {
    const {
        options, dataArray, setData,
        getData, haveData, selectTopicId,
        condition, isMobile
    } = props

    const {columns, columns_gap} = options

    //提取出瀑布流的gap
    const innerColumns = Number(columns_gap.match(/\d+/)[0])

    //瀑布流里层高度，撑起整个内部div高度
    const [containerHeight, setContainerHeight] = useState(0)

    //betterScroll对象
    const [scroll, setScroll] = useState({} as BScroll)

    //渲染后的结果，保证瀑布流会在子对象更新后重新加载
    const [itemList, setItemList] = useState([])

    const containerRef = useRef(null)

    //窗口大小改变重新执行瀑布流
    useEffect(() => {
        window.onresize = () => {
            waterfallInit()
        }
        return () => {
            window.onresize = null
        }
    }, [])

    useEffect(() => {
        const config = isMobile ? {
            scrollY: true,
            pullUpLoad: true,
            mouseWheel: true,
            bounce: {
                top: false,
                bottom: true,
                left: false,
                right: false
            },
            click: true,
        } : {
            scrollY: false,
            click: true,
        }
        setScroll(new BScroll('.better-scroll', config))
    }, [])

    useEffect(() => {
        if (dataArray.length > 0) {
            setItemList(renderItem(dataArray))
        } else {
            setItemList([])
        }
    }, [dataArray])

    useEffect(() => {
        itemList && waterfallInit()
    }, [itemList])

    useEffect(() => {
        const bsIsExist = Object.keys(scroll).length > 0
        bsIsExist && scroll.scrollTo(0, 0, 0)
    }, [selectTopicId, condition])

    useEffect(() => {
        let innerGetData: () => void
        const bsIsExist = Object.keys(scroll).length > 0
        if (bsIsExist && isMobile) {
            innerGetData = () => {
                console.log("我到底了")
                getData(() => {
                    scroll.finishPullUp()
                })
            }
            scroll.on('pullingUp', innerGetData)
            scroll.refresh()
        }
        return () => {
            bsIsExist && isMobile && scroll.off("pullingUp", innerGetData)
        }
    }, [scroll, containerHeight])

    const minBox = (array: Array<number>) => {
        let arrayIndex = 0
        let minBoxHeight = 0
        array.forEach((item, index) => {
            if (array[arrayIndex] >= array[index]) {
                arrayIndex = index
                minBoxHeight = item
            }
        })
        return [arrayIndex, minBoxHeight];
    }

    const renderItem = (dataArray: Array<any>) => {
        return dataArray.length > 0 && dataArray?.map((item, index) => {
            return <div
                key={index}
                className="waterfall-container-item"
                style={{
                    marginRight: columns_gap,
                    marginLeft: columns_gap,
                }}
            >
                <CommunityItem
                    item={item}
                    index={index}
                    setData={setData}
                    dataArray={dataArray}
                />
            </div>
        })
    }

    const waterfallInit = () => {
        const childrenDomArray = document.getElementsByClassName("content-container-item")
        const containerWidth = containerRef?.current?.clientWidth;

        const childrenWidth = containerWidth / columns;
        const finalChildrenWidth = `calc(${containerWidth / columns - 2 * innerColumns}px)`;
        let firstDomHeightArray: number[] = []
        for (let i = 0; i < childrenDomArray.length; i++) {
            const dom = (childrenDomArray[i] as any)
            dom.style.width = finalChildrenWidth;
            const boxHeight = dom.offsetHeight
            if (i < options.columns) {
                firstDomHeightArray.push(boxHeight)
            } else {
                const [minIndex, minBoxHeight] = minBox(firstDomHeightArray);
                dom.style.position = 'absolute';
                dom.style.left = minIndex * childrenWidth + innerColumns + "px";
                dom.style.top = minBoxHeight + innerColumns + "px";
                firstDomHeightArray[minIndex] += boxHeight + innerColumns;
            }
        }
        const maxHeight = Math.max(...firstDomHeightArray)
        setContainerHeight(maxHeight > 0 && maxHeight + 50)
    }

    return (
        <div
            className="better-scroll"
            style={{height: !isMobile && "100%"}}
        >
            <div
                className="waterfall-container"
                ref={containerRef}
                style={{height: containerHeight}}
            >
                {itemList}
                <div style={{top: containerHeight}} className="tips">
                    {!haveData ? "没有更多了" : "加载更多"}
                </div>
            </div>
        </div>
    );
}