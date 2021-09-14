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
        if (type === "add") {
            setPagination({
                ...pagination,
                pageNum: pageNum + 1
            })
        }
        if (type === "sub") {
            setPagination({
                ...pagination,
                pageNum: pageNum - 1
            })
        }
    }

    return (<React.Fragment>
        {total > 0 && <div style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: height,
            justifyContent: "center"
        }}>
            <div style={{width: left}}>
                <Button
                    type={pageNum === 1 ? "disable" : "primary"}
                    onClick={() => {
                        operationPageNum("sub")
                    }}
                >
                    上一页
                </Button>
            </div>
            <div style={{
                width: center,
                textAlign: "center",
                fontWeight: 600,
                fontSize: "1.4rem"
            }}>
                {`${pageNum} / ${Math.ceil(total / pageSize)}`}
            </div>
            <div style={{width: right}}>
                <Button
                    type={(pageNum === Math.ceil(total / pageSize)) ? "disable" : "primary"}
                    onClick={() => {
                        operationPageNum("add")
                    }}
                >
                    下一页
                </Button>
            </div>
        </div>}
    </React.Fragment>)
};

export default Pagination;