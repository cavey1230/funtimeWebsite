import React, {useEffect, useState} from 'react';
import {showToast} from "@/utils/lightToast";
import useLocalStorage from "@/customHook/useLocalStorage";
import {useActivate, useUnactivate} from 'react-activation';

type UsePagination = (
    initializePageNum: number, initializePageSize: number,
    total: number, options: {
        key?: string,
        delay?: number,
        tipsString: string
    }
) => [
    { pageNum: number, pageSize: number },
    (obj: { pageNum: number, pageSize: number }) => void
]

let usePaginationObject: { [key: string]: boolean } = {}

const usePagination: UsePagination = (
    initializePageNum, initializePageSize,
    total, options
) => {
    const [pagination, setPagination] = useState({
        pageNum: initializePageNum,
        pageSize: initializePageSize
    })

    const [getLocalstorage] = useLocalStorage()

    useActivate(() => {
        // console.log("我被激活了")
        usePaginationObject[options.key] = true
        // console.log(usePaginationObject)
    })

    useUnactivate(() => {
        usePaginationObject[options.key] = false
    })

    useEffect(() => {
        let timeOutId: NodeJS.Timer
        const scroll = () => {
            const scrollTop = document.body.scrollTop
            const innerHeight = window.innerHeight
            const scrollHeight = document.body.scrollHeight
            if (
                // getLocalstorage("drawIsWheel") === "false" ||
                // getLocalstorage("modalIsWheel") === "false" ||
                // getLocalstorage("searchIsWheel") === "false"
                getLocalstorage("modalIsWheel") === "false"
            ) {
                return
            }
            if ((scrollTop + innerHeight >= scrollHeight) && scrollHeight !== innerHeight) {
                const {pageNum, pageSize} = pagination
                clearTimeout(timeOutId)
                timeOutId = setTimeout(() => {
                    if ((pageNum * pageSize) < total) {
                        setPagination(prevState => {
                            const {pageNum, pageSize} = prevState
                            return {
                                pageNum: pageNum + 1, pageSize
                            }
                        })
                    } else {
                        showToast(options.tipsString, "warn")
                    }
                }, options.delay || 100)
            }
        }
        usePaginationObject[options.key] = true

        function scrollFunc() {
            usePaginationObject[options.key] && scroll()
        }

        document.body.addEventListener("scroll", scrollFunc)
        return () => {
            usePaginationObject[options.key] = false
            document.body.removeEventListener("scroll", scrollFunc)
        }
    }, [window.innerHeight, total, pagination])

    const init = () => {
        setPagination({
            pageNum: initializePageNum,
            pageSize: initializePageSize
        })
    }
    return [pagination, setPagination]
};

export default usePagination;