import React, {useEffect, useRef, useState} from 'react';

import "./waterfall.less";
import CommunityItem from "@/pages/main/community/communityItem";

interface Props {
    options: {
        columns: number,
        columns_gap: string
    }
    dataArray: Array<any>
    setData: (data: any) => void
}

export const Waterfall: React.FC<Props> = (props) => {
    const {options, dataArray, setData} = props

    const {columns, columns_gap} = options

    const innerColumns = Number(columns_gap.match(/\d+/)[0])

    const containerRef = useRef(null)

    const [containerHeight, setContainerHeight] = useState(0)

    useEffect(() => {
        if (dataArray.length > 0) {
            waterfallInit()
            // 解决padding丢失
            setTimeout(() => {
                waterfallInit()
            }, 1000)
        }
        window.onresize = () => {
            waterfallInit()
        }
        return () => {
            window.onresize = null
        }
    }, [dataArray])

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
        setContainerHeight(maxHeight > 0 && maxHeight + 100)
    }

    return (
        <div
            className="waterfall-container"
            ref={containerRef}
            style={{height: containerHeight}}
        >
            {dataArray.length > 0 && dataArray?.map((item, index) => {
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
            })}
        </div>
    );
}