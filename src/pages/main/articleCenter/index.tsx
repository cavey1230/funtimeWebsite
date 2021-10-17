import React, {useRef, useState} from 'react';
import ArticleNavbar from "@/pages/main/articleCenter/articleNavbar";
import ArticleMarkDown from "@/pages/main/articleCenter/articleMarkDown";
import Draw from "@/basicComponent/Draw";
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";
import Button from "@/basicComponent/Button";

import "./index.less";

const Index = () => {
    const [data, setData] = useState()

    const isMobile = useSelector((store: ReduxRootType) => {
        return store.windowResizeReducer.isMobile
    })

    const [drawVisible, setDrawVisible] = useState(isMobile)

    const articleNavbarRef = useRef(null)

    return (
        <div className="article-container">
            {!isMobile && <div className="left-pad">
                <ArticleNavbar
                    ref={articleNavbarRef}
                    onChange={(value) => {
                        setData(value)
                    }}
                />
            </div>}
            <div className="right-pad">
                <div className="right-pad-button">
                    {isMobile && <Button
                        onClick={() => {
                            setDrawVisible(pre => !pre)
                        }}>
                        重新选择文章
                    </Button>}
                </div>
                <ArticleMarkDown
                    flushData={articleNavbarRef.current &&
                    articleNavbarRef.current.flushData}
                    data={data}
                />
            </div>
            {isMobile && <Draw
                visible={drawVisible}
                onClose={() => {
                    setDrawVisible(false)
                }}
                width={"20rem"}
            >
                <ArticleNavbar
                    ref={articleNavbarRef}
                    onChange={(value) => {
                        console.log(value)
                        setData(value)
                    }}
                />
            </Draw>}
        </div>
    );
};

export default Index;