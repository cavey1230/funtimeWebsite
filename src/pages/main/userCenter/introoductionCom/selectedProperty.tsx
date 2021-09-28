import classnames from '@/utils/classnames';
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from 'react';

import "./selectedProperty.less";

interface Props {
    initializeData?: {
        selectedPropertyId: Array<number>,
        selectedPropertyWithRange: Array<number>
    }
    propertyList: Array<any>
    onChange?: (data: Props["initializeData"] | {}) => void
}


const SelectedProperty: React.FC<Props & React.RefAttributes<any>> = forwardRef((
    props, ref
) => {
    const {initializeData, propertyList, onChange} = props

    const innerInitializeData: typeof initializeData = {
        selectedPropertyId: [],
        selectedPropertyWithRange: []
    }

    const [data, setData] = useState(initializeData || innerInitializeData)

    useEffect(() => {
        onChange && onChange(filterData(data))
    }, [data])

    useEffect(()=>{
        initializeData && setData(initializeData)
    },[initializeData])

    useImperativeHandle(ref, () => ({
        value: filterData(data),
        setValue: () => {
            setData(innerInitializeData)
        }
    }))

    const clearRange = useCallback((id: number) => {
        const {selectedPropertyId, selectedPropertyWithRange} = data
        const indexOfId = selectedPropertyId.indexOf(id)
        if (indexOfId >= 0) {
            const copyIdArray = [...selectedPropertyId]
            copyIdArray.splice(indexOfId, 1)
            const copyRangeArray = [...selectedPropertyWithRange]
            copyRangeArray.splice(indexOfId, 1)
            setData({
                selectedPropertyId: copyIdArray,
                selectedPropertyWithRange: copyRangeArray
            })
        }
    }, [data])

    const filterData = useCallback((data: typeof initializeData) => {
        const idLen = data.selectedPropertyId.length
        const rangeLen = data.selectedPropertyWithRange.length
        return (idLen === 0 || rangeLen === 0 || idLen !== rangeLen) ? {} : data
    }, [])

    const renderFillItem = useCallback((id: number) => {
        const {selectedPropertyId, selectedPropertyWithRange} = data
        const indexOfId = selectedPropertyId.indexOf(id)

        const getClassName = (index: number, indexOfId: number) => {
            return classnames("fill-box", {
                "fill-box-selected": index + 1 <= selectedPropertyWithRange[indexOfId]
            })
        }

        const handleClick = (index: number, indexOfId: number) => {
            if (indexOfId >= 0) {
                const copySelectedWithRange = [...selectedPropertyWithRange]
                copySelectedWithRange.splice(indexOfId, 1, index + 1)
                setData({
                    selectedPropertyId: selectedPropertyId,
                    selectedPropertyWithRange: copySelectedWithRange
                })
            } else {
                setData({
                    selectedPropertyId: selectedPropertyId.concat(id),
                    selectedPropertyWithRange: selectedPropertyWithRange.concat(index + 1)
                })
            }
        }

        return new Array(6).fill("").map((
            item, index
        ) => {
            return <div
                key={index}
                className={getClassName(index, indexOfId)}
                onClick={() => {
                    handleClick(index, indexOfId)
                }}
            />
        })
    }, [data])

    const renderPropertyList = (arr: Array<any>) => {
        return arr?.map(item => {
            const {id, name} = item
            return <div
                key={id}
                className="user-center-property-list-item"
            >
                <div
                    className="user-center-property-list-item-label"
                    onClick={() => {
                        clearRange(id)
                    }}
                >
                    {name}
                </div>
                <div className="user-center-property-list-item-fill-box-group">
                    {renderFillItem(id)}
                </div>
            </div>
        })
    }

    return (
        <div className="user-center-property-list-container">
            {renderPropertyList(propertyList)}
        </div>
    );
})

export default SelectedProperty;