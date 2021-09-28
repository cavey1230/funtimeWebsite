import React, {useCallback, useEffect, useMemo, useState} from 'react';
import "./generateCard.less";
import {getOneIntroduction} from "@/api/v1/introduction";
import useLocalStorage from "@/customHook/useLocalStorage";
import Loading from "@/basicComponent/Loading";
import FieldsetContainer from './publicComponent/fieldsetContainer';
import Button from '@/basicComponent/Button';
import {confirm} from "@/basicComponent/Confirm";
import {useHistory} from "react-router-dom";
import {useActivate} from 'react-activation';
import CardTemplate from "@/pages/main/userCenter/generateCardCom/cardTemplate";
import CardTemplate2 from "@/pages/main/userCenter/generateCardCom/cardTemplate2";
import classnames from "@/utils/classnames";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom";
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";

const GenerateCard = () => {

    const [data, setData] = useState({})

    const [condition, setCondition] = useState({
        keyword: "leftAndRight",
        fontFamily: "",
        selectImgIndex: 0
    })

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [getLocalStorage] = useLocalStorage()

    const history = useHistory()

    const isMobile = useSelector((state: ReduxRootType) => {
        return state.windowResizeReducer.isMobile
    })

    const userId = getLocalStorage("userId")

    const cardBasePosition = useMemo(() => [{
        name: "左右布局",
        key: "leftAndRight",
        recommend: "经典布局，左右为资料卡基本信息"
    }, {
        name: "上下布局",
        key: "poster",
        recommend: "突出展示游戏内人物，下方为资料卡基本信息"
    }], [])

    const fontFamilyList = useMemo(() => [{
        name: "快乐体",
        key: "KLT",
        recommend: "字体风格偏硬朗，有明显的棱角，适合猛男使用"
    }, {
        name: "文艺体",
        key: "WYT",
        recommend: "字体风格偏硬朗但比快乐体柔软一点，中规中矩"
    }, {
        name: "康康体",
        key: "KKT",
        recommend: "非常柔和的一款字体，适合0和女角色使用"
    }, {
        name: "系统自带字体",
        key: "",
        recommend: "选这个可以节约服务器资源，默认为此字体"
    }], [])

    useEffect(() => {
        isMobile && confirm({
            title: "当前页面手机端展示效果不太好",
            content: "推荐使用PC端进行操作",
            onClickText: "了解"
        })
        getData()
    }, [])

    const getData = () => {
        setLoadingVisible(true)
        getOneIntroduction({userId}).then(res => {
            setLoadingVisible(false);
            (res.status === 200 && res.data !== null) ?
                setData(res.data) : confirm({
                    title: "你还没有个人情报",
                    content: "是否去创建,否则无法生成资料卡",
                    onClick: () => {
                        history.push("/main/userCenter/2")
                    }
                })
        })
    }

    useActivate(() => {
        getData()
    })

    const renderCard = useCallback((
        arr: Array<any>, model: "keyword" | "fontFamily" | "img"
    ) => (
        arr?.map((item, index) => {
            const {name, key, recommend} = item
            return <div
                key={index}
                className={classnames("generate-card-item", {
                    "generate-card-item-selected": (
                        (model === "keyword" && condition.keyword === key) ||
                        (model === "fontFamily" && condition.fontFamily === key) ||
                        (model === "img" && condition.selectImgIndex === index)
                    )
                })}
                onClick={() => {
                    if (!data) return
                    model === "keyword" ? setCondition({
                        ...condition, keyword: key
                    }) : model === "fontFamily" ? setCondition({
                        ...condition, fontFamily: key
                    }) : setCondition({
                        ...condition, selectImgIndex: index
                    })
                }}
            >
                <div>{model !== "img" && name}</div>
                <div className="generate-card-item-recommend">
                    {recommend ? recommend : data && <img src={item} alt="url"/>}
                </div>
            </div>
        })
    ), [condition])

    const {keyword, selectImgIndex, fontFamily} = condition

    return (
        <React.Fragment>
            <FieldsetContainer title={"布局选择"}>
                <div className="generate-card-container">
                    {renderCard(cardBasePosition, "keyword")}
                </div>
            </FieldsetContainer>
            <FieldsetContainer title={"字体选择"}>
                <div className="generate-card-container">
                    {renderCard(fontFamilyList, "fontFamily")}
                </div>
            </FieldsetContainer>
            <FieldsetContainer title={"选择主图"}>
                <div className="generate-card-container">
                    {renderCard((data as any).imgArray, "img")}
                </div>
            </FieldsetContainer>
            <FieldsetContainer title={"预览"}>
                <div className="generate-thumbnail-container">
                    {keyword === "leftAndRight" && <div id="canvas-bind-div">
                        <CardTemplate
                            fontFamily={fontFamily}
                            data={data}
                            selectImgIndex={selectImgIndex}
                        />
                    </div>}
                    {keyword === "poster" && <div id="canvas-bind-div">
                        <CardTemplate2
                            fontFamily={fontFamily}
                            data={data}
                            selectImgIndex={selectImgIndex}
                        />
                    </div>}
                </div>
            </FieldsetContainer>
            <Button onClick={() => {
                const dom = document.getElementById('canvas-bind-div')
                html2canvas(dom, {
                    allowTaint: true,
                    useCORS: true,
                    width: keyword === "poster" ? 768 : 1366,
                    height: keyword === "poster" ? 1366 : 768
                }).then((canvas: any) => {
                    const url = canvas.toDataURL();  // 导出图片
                    const aTarget = document.createElement("a")
                    aTarget.href = url
                    aTarget.download = `${(data as any).gameRoleName}的资料卡.jpg`
                    document.body.appendChild(aTarget)
                    ReactDOM.createPortal(document.body, aTarget)
                    aTarget.click()
                    document.body.removeChild(aTarget)
                });
            }}>
                生成并下载
            </Button>
            <Loading visible={loadingVisible}/>
        </React.Fragment>
    );
};

export default GenerateCard;