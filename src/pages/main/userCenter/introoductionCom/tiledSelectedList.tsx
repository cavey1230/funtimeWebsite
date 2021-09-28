import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {roleImgAddress} from "@/assets/img/returnImgByName";
import classnames from '@/utils/classnames';

import "./tiledSelectedList.less";

interface Props {
    list: Array<any>
    onChange?: (value: Props["initializeData"] | {}) => void
    initializeData?: {
        id?: number
        list?: Array<any>
    }
    model?: "list" | "id"
    showIcon?: boolean
}

const TiledSelectedList: React.FC<Props & React.RefAttributes<any>> = forwardRef((
    props, ref
) => {
    const {list, onChange, initializeData, showIcon, model} = props

    const innerModel = model ? model : "id"

    const initiallyData: typeof initializeData = {
        id: -1,
        list: []
    }

    const [data, setData] = useState(initializeData || initiallyData)

    useEffect(() => {
        onChange && onChange(sort(data, innerModel))
    }, [data])

    useEffect(() => {
        initializeData && setData(initializeData)
    }, [initializeData])

    useImperativeHandle(ref, () => ({
        value: sort(data, innerModel),
        setValue: () => {
            setData(initiallyData)
        }
    }))

    const sort = (param: typeof data, model: Props["model"]) => {
        const {list, id} = param
        if (model === "id" && id < 0) {
            return {}
        } else if (model === "id" && id >= 0) {
            return {id}
        }
        if (model === "list" && list.length === 0) {
            return {}
        } else if (model === "list" && list.length > 0) {
            return {list: list.sort((store, next) => store - next)}
        }
    }

    const renderRoleList = (roleList: Array<any>) => {
        const {id: dataId, list: datalist} = data

        const getClassName = (id: number) => {
            return classnames("user-center-introduction-tiled-list-item", {
                "tiled-list-selected": innerModel === "id" ? dataId === id : datalist.includes(id)
            })
        }

        const onClick = (id: number) => {
            if (innerModel === "id") {
                setData({...data, id})
                return
            }
            if (datalist.includes(id)) {
                const copyList = [...datalist]
                const index = datalist.findIndex(item => item === id)
                copyList.splice(index, 1)
                setData({...data, list: copyList})
            } else {
                setData({...data, list: [...datalist, id]})
            }
        }

        return roleList?.map(item => {
            const {id, name} = item
            return <div
                key={id}
                className={getClassName(id)}
                onClick={() => {
                    onClick(id)
                }}
            >
                {showIcon && <img src={roleImgAddress(name)} alt="tiled-list-img"/>}
                <span>{name}</span>
            </div>
        })
    }

    return (
        <div className="user-center-introduction-tiled-list-container">
            {renderRoleList(list)}
        </div>
    );
})

export default TiledSelectedList;