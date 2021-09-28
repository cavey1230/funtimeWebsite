import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from 'react';
import {getCareerImg, getDetailsCategoryCareer} from "@/pages/main/introductionDetails/categoryCareer";
import classnames from "@/utils/classnames";
import {MultiChoiceIcon, MultiWithNoChoiceIcon} from "@/assets/icon/iconComponent";

import "./selectedCareer.less";

interface Props {
    careerList: Array<any>
    onChange?: (value: any) => void
    initializeData?: {
        mainCareerId: number,
        careerIdList: Array<any>
    }
}

const SelectedCareer: React.FC<Props & React.RefAttributes<any>> = forwardRef((
    props, ref
) => {
    const {careerList, onChange, initializeData} = props

    const [data, setData] = useState(initializeData || {
        mainCareerId: 0,
        careerIdList: []
    })

    const categoryCareer = useMemo(() => {
        return getDetailsCategoryCareer(careerList)
    }, [careerList])

    const checkWhetherDataIsEmpty = useCallback((param: typeof data) => {
        const {mainCareerId, careerIdList} = param
        return (mainCareerId === 0 || careerIdList.length === 0) ? {} : param
    }, [])

    useEffect(() => {
        setData(initializeData)
    }, [initializeData])

    useEffect(() => {
        onChange && onChange(checkWhetherDataIsEmpty(data))
    }, [data])

    useImperativeHandle(ref, () => ({
        value: checkWhetherDataIsEmpty(data),
        setValue: () => {
            setData({
                mainCareerId: 0,
                careerIdList: []
            })
        }
    }))

    const renderCareerList = useCallback((arr: Array<any>, obj: typeof data) => {
        const {mainCareerId, careerIdList} = obj

        const allSelected = (index: number) => {
            return arr[index].map((item: { [key: string]: any }) => {
                return careerIdList.includes(item.id)
            }).filter((i: boolean) => i).length === arr[index].length
        }

        const selectedRowData = (arr: Array<any>) => {
            let includeArr: number[] = []
            const idArray = arr.map(item => {
                const {id} = item
                const index = careerIdList.findIndex(i => i === id)
                index >= 0 && includeArr.push(id)
                return id
            })
            if (arr.length === includeArr.length) {
                const copyCareerIdList = [...careerIdList]
                let innerMainCareerId = mainCareerId
                includeArr.forEach((item) => {
                    item === mainCareerId && (innerMainCareerId = 0)
                    const index = copyCareerIdList.findIndex(i => i === item)
                    copyCareerIdList.splice(index, 1)
                })
                setData({
                    mainCareerId: innerMainCareerId,
                    careerIdList: copyCareerIdList
                })
            } else {
                const innerArray = Array.from(new Set([...careerIdList, ...idArray]))
                setData({
                    mainCareerId, careerIdList: innerArray
                })
            }
        }

        const getClassName = (id: number) => {
            return classnames("user-center-career-details-item", {
                "selected": careerIdList.includes(id),
                "main-selected": mainCareerId === id
            })
        }

        const itemClickFunc = (id: number) => {
            const afterPushIdAtArray = [...careerIdList, id]
            const setList = (arr: Array<any>) => {
                setData({...data, careerIdList: arr})
            }
            const index = careerIdList.indexOf(id)
            if (index >= 0) {
                const copyCareerIdList = [...careerIdList]
                copyCareerIdList.splice(index, 1)
                mainCareerId === id ? setData({
                    careerIdList: copyCareerIdList,
                    mainCareerId: 0
                }) : setList(copyCareerIdList)
            } else {
                mainCareerId === 0 ? setData({
                    careerIdList: afterPushIdAtArray,
                    mainCareerId: id
                }) : setList(afterPushIdAtArray)
            }
        }

        return arr?.map((item, index) => {
            return <div className="user-center-career-row" key={index}>
                <div className="user-center-career-first-category">
                    {item.map((item2: any) => {
                        const {id, name} = item2
                        return <div
                            key={id}
                            className={getClassName(id)}
                            onClick={() => {
                                itemClickFunc(id)
                            }}
                        >
                            <img src={getCareerImg(name)} alt={`career_icon_${id}`}/>
                            <span>{name}</span>
                        </div>
                    })}
                </div>
                <div onClick={() => {
                    selectedRowData(item)
                }}>
                    {allSelected(index) ? <MultiChoiceIcon/> :
                        <MultiWithNoChoiceIcon/>}
                </div>
            </div>
        })
    }, [data])

    return (
        <div className="user-center-career-group">
            {renderCareerList(categoryCareer, data)}
        </div>
    )
})

export default SelectedCareer;