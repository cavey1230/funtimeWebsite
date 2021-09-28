import React, { useEffect, useMemo, useState} from 'react';

import "./Screening.less";
import {ExpandIcon, NoExpandIcon} from "@/assets/icon/iconComponent";

interface Props {
    setCondition: (obj: Array<string>) => void
    labelArray: Array<{ name: string, key: string }>
    style?: { [key: string]: any }
}

const Screening: React.FC<Props> = (props) => {

    const {setCondition: setCallBackCondition, labelArray, style} = props

    const [condition, setCondition] = useState(useMemo(() => {
        return labelArray?.reduce((store, item) => {
            store[item.key] = ""
            return store
        }, {} as {[key: string]: string})
    }, []))

    type ConditionKeyParams = keyof typeof condition

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            Object.keys(condition).forEach((item: ConditionKeyParams) => {
                if (condition[item]) {
                    setCallBackCondition([item as string, condition[item]])
                }
            })
        }, 500)
        return () => {
            clearTimeout(timeOutId)
        }
    }, [condition])

    const onClick = (type: ConditionKeyParams) => {
        Object.keys(condition).map(item => {
            if (item !== type) {
                condition[item as ConditionKeyParams] = ""
            } else {
                if (!condition[type]) {
                    condition[type] = "up"
                } else if (condition[type] === "up") {
                    condition[type] = "down"
                } else if (condition[type] === "down") {
                    condition[type] = ""
                }
            }
        })
        setCondition({...condition})
    }

    const renderConditionItem = () => {
        const imgStatusControl = (key: ConditionKeyParams) => {
            if (condition[key] === "up") {
                return <NoExpandIcon/>
            }
            if (condition[key] === "down") {
                return <ExpandIcon/>
            }
        }

        return labelArray?.map((item, index) => {
            const {name, key} = item
            return <div
                key={index}
                className="condition-list-item"
                onClick={() => {
                    onClick(key)
                }}
            >
                {condition[key] && imgStatusControl(key)}
                <span>{name}</span>
            </div>
        })
    }

    return (
        <div className="condition-group" style={style}>
            <div className="condition-list">
                {renderConditionItem()}
            </div>
        </div>
    );
};

export default Screening;