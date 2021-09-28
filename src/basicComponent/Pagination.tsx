import React from 'react';

import Button from "@/basicComponent/Button";

interface Props {
    total: number
    pagination: {
        pageNum: number
        pageSize: number
    }
    setPagination: (pagination: Props["pagination"]) => void
    height: string
    layoutOptions: {
        left: string
        center: string
        right: string
    }
}


const Pagination: React.FC<Props> = (props) => {

    const {total, pagination, setPagination, layoutOptions, height} = props

    const {pageNum, pageSize} = pagination

    const {left, center, right} = layoutOptions

    const operationPageNum = (type: "add" | "sub") => {
        setPagination({
            ...pagination,
            pageNum: type === "add" ? pageNum + 1 : pageNum - 1
        })
    }

    const maxPageNum = Math.ceil(total / pageSize)

    return (<React.Fragment>
        {total > 0 && <div style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: height,
            justifyContent: "center"
        }}>
            {total > pageSize && <div style={{width: left}}>
                <Button
                    type={pageNum === 1 ? "disable" : "primary"}
                    onClick={() => {
                        operationPageNum("sub")
                    }}
                >
                    上一页
                </Button>
            </div>}
            <div style={{
                width: center,
                textAlign: "center",
                fontWeight: 600,
                fontSize: "1.4rem"
            }}>
                {`${pageNum} / ${maxPageNum}`}
            </div>
            {total > pageSize && <div style={{width: right}}>
                <Button
                    type={pageNum === maxPageNum ? "disable" : "primary"}
                    onClick={() => {
                        operationPageNum("add")
                    }}
                >
                    下一页
                </Button>
            </div>}
        </div>}
    </React.Fragment>)
}

export default Pagination;