import React from 'react';
import {useActivate, useAliveController} from 'react-activation';

export const useKeepaliveNameControl = (nameList: Array<string>, showLog: boolean = false) => {

    const {dropScope, getCachingNodes} = useAliveController()

    useActivate(() => {
        const hasKeepaliveNameList = getCachingNodes().map(item => item.name)
        nameList.forEach((item) => {
            if (hasKeepaliveNameList.includes(item)) {
                dropScope(item).then(res => {
                    if (showLog) {
                        console.log(res)
                        console.log(getCachingNodes())
                    }
                })
            }
        })
    })

};