import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {useRouteMatch} from "react-router-dom";
import {findHighOrderCommunity} from "@/api/v1/community";
import Pagination from "@/basicComponent/Pagination";
import {getMarkDownContent} from '@/utils/stringMatchingTool';
import useTimeChanger from "@/customHook/useTimeChanger";
import classnames from '@/utils/classnames';

import "./articleNavbar.less";

interface Props {
    onChange: (value: any) => void
}

const ArticleNavbar: React.FC<Props & React.RefAttributes<any>> = forwardRef((
    props, ref
) => {
    const {onChange} = props

    const [pagination, setPagination] = useState({
        pageSize: 4,
        pageNum: 1
    })

    const [total, setTotal] = useState(0)

    const [list, setList] = useState([])

    const [selectId, setSelectId] = useState(0)

    const [content, setContent] = useState("")

    const timeChanger = useTimeChanger()

    const match = useRouteMatch()

    const userId = Number((match.params as any).userId)

    useEffect(() => {
        if (list?.length > 0) {
            const firstData = list[0]
            selectId === 0 && setSelectId(firstData.id)
            onChange && onChange(selectId === 0 ? firstData :
                list.find(item => item.id === selectId))
        }
    }, [list])

    useEffect(() => {
        getData()
    }, [pagination])

    useImperativeHandle(ref, () => ({
        flushData: getData
    }))

    const getData = () => {
        const {pageNum, pageSize} = pagination
        findHighOrderCommunity({
            pageNum, pageSize, userId, content
        }).then(res => {
            res.status === 200 && setList(res.data.data)
            res.status === 200 && setTotal(res.data.total)
            if (content.length > 0) {
                setContent("")
            }
        })
    }

    const renderList = (arr: Array<any>) => {
        return arr?.map(item => {
            const {createTime, likeNum, lookNum, messageNum, content, imgArray, id} = item
            return <div
                key={id}
                className={classnames("article-navbar-list-item", {
                    "article-navbar-list-item-selected": selectId === id
                })}
                onClick={() => {
                    setSelectId(id)
                    onChange && onChange(item)
                }}
            >
                <div>
                    {timeChanger(createTime)}
                </div>
                <div>
                    {getMarkDownContent(content.slice(0, 50))}
                </div>
                <div className="statistic">
                    <div>
                        <span>喜欢:</span>
                        <span>{likeNum}</span>
                    </div>
                    <div>
                        <span>查看:</span>
                        <span>{lookNum}</span>
                    </div>
                    <div>
                        <span>消息:</span>
                        <span>{messageNum}</span>
                    </div>
                </div>
                {imgArray?.length > 0 && <div className="img-group">
                    <img src={imgArray[0]} alt="img"/>
                </div>}
            </div>
        })
    }

    return (
        <div className="article-navbar-container">
            <div className="article-navbar-list-group">
                {renderList(list)}
            </div>
            <Pagination
                total={total}
                pagination={pagination}
                setPagination={setPagination}
                height={"3rem"}
                layoutOptions={{
                    left: "25%",
                    center: "50%",
                    right: "25%"
                }}
            />
        </div>
    );
})

export default ArticleNavbar;