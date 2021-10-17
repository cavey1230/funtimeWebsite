import React, {useEffect, useMemo, useRef, useState} from 'react';
import FieldsetContainer from "@/pages/main/userCenter/publicComponent/fieldsetContainer";
import WithLabel from './publicComponent/withLabel';
import Button from "@/basicComponent/Button";
import {Form, FormItem} from "@/basicComponent/Form";
import TiledSelectedList from "@/pages/main/userCenter/introoductionCom/tiledSelectedList";
import Upload from "@/basicComponent/Upload";
import useLocalStorage from "@/customHook/useLocalStorage";
import Loading from "@/basicComponent/Loading";
import {showToast} from "@/utils/lightToast";
import useUploadImg from "@/customHook/useUploadImg";
import {editPersonalHomeSetting, getPersonalHomeSetting} from "@/api/v1/personalHome";
import Selector from '@/basicComponent/Selector';

import "./introduction.less";

const PersonalHomeSetting = () => {
    const [data, setData] = useState({
        id: 0,
        showGameInfo: 0,
        showJoinActivity: 0,
        showCommunity: 0,
        showComment: 0,
        showReply: 0,
        maxCommunityTotal: 10,
        backgroundImg: ""
    })

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [getLocalStorage] = useLocalStorage()

    const userId = getLocalStorage("userId")

    const uploadImg = useUploadImg()

    const formRef = useRef(null)

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        setLoadingVisible(true)
        getPersonalHomeSetting({userId}).then(res => {
            setLoadingVisible(false)
            res.status === 200 && setData(res.data)
        })
    }

    const submit = (value: any) => {
        const {
            warning, backgroundImg, maxCommunityTotal,
            showGameInfo, showJoinActivity, showCommunity,
            showComment, showReply
        } = value
        if (!warning) {
            const fetchData = {
                showGameInfo: showGameInfo.id,
                showJoinActivity: showJoinActivity.id,
                showCommunity: showCommunity.id,
                showComment: showComment.id,
                showReply: showReply.id,
                maxCommunityTotal: Number(maxCommunityTotal),
                backgroundImg,
                id: data.id
            }
            backgroundImg.length > 0 && uploadImg(backgroundImg, (result) => {
                fetchData.backgroundImg = result[0]
                editPersonalHomeSetting(fetchData).then(res => {
                    if (res.status === 200) {
                        showToast("修改成功")
                        // getData()
                    }
                })
            })
        }
    }

    const totalSetting = [{
        name: "6条",
        data: 6,
    }, {
        name: "12条",
        data: 12,
    }, {
        name: "18条",
        data: 18,
    }]

    const condition = [{id: 0, name: "否"}, {id: 1, name: "是"}]

    const {
        showGameInfo, showJoinActivity,
        showCommunity, showComment,
        showReply, maxCommunityTotal,
        backgroundImg
    } = data

    const formList = useMemo(() => {
        return [{
            name: "showGameInfo",
            data: showGameInfo,
            label: "游戏信息展示",
            tips: "游戏信息展示为必选"
        }, {
            name: "showJoinActivity",
            data: showJoinActivity,
            label: "参与过活动展示",
            tips: "参与过活动展示为必选"
        }, {
            name: "showCommunity",
            data: showCommunity,
            label: "近期动态展示",
            tips: "近期动态展示为必选"
        }, {
            name: "showComment",
            data: showComment,
            label: "近期评论展示",
            tips: "近期评论展示为必选"
        }, {
            name: "showReply",
            data: showReply,
            label: "近期回复展示",
            tips: "近期回复展示为必选"
        }]
    }, [data])

    return (
        <div className="user-center-introduction-container">
            <FieldsetContainer title={"个人主页设置"}>
                <Form
                    ref={formRef}
                    reload={[showGameInfo, showJoinActivity,
                        showCommunity, showComment,
                        showReply, maxCommunityTotal,
                        backgroundImg]}
                    onFinish={submit}
                >
                    <FormItem
                        label={"maxCommunityTotal"}
                        name={"maxCommunityTotal"}
                        reload={[maxCommunityTotal]}
                        condition={{
                            required: {value: true, tips: "人物主图为必选项"},
                        }}
                    >
                        <WithLabel label={"动态展示条数"} formItemModel={true}>
                            <Selector
                                returnString={true}
                                options={totalSetting}
                                returnValueKey={"data"}
                                labelKey={"name"}
                                initializeValue={maxCommunityTotal}
                                placeholder={"展示条数"}
                            />
                        </WithLabel>
                    </FormItem>
                    <FormItem
                        label={"backgroundImg"}
                        name={"backgroundImg"}
                        reload={[backgroundImg]}
                        condition={{
                            required: {value: true, tips: "背景图为必选"},
                        }}
                    >
                        <WithLabel label={"背景图"} formItemModel={true}>
                            <Upload
                                initializeFileUrlList={backgroundImg && [backgroundImg]}
                                maxFileLength={1}
                                acceptFileType={"image/png,image/jpeg"}
                            />
                        </WithLabel>
                    </FormItem>
                    {formList.map((item, index) => {
                        const {name, data, label, tips} = item
                        return <FormItem
                            key={index}
                            label={name}
                            name={name}
                            reload={[data]}
                            condition={{
                                required: {value: true, tips},
                            }}
                        >
                            <WithLabel label={label} formItemModel={true}>
                                <TiledSelectedList
                                    list={condition}
                                    initializeData={{id: data}}
                                />
                            </WithLabel>
                        </FormItem>
                    })}
                    <FormItem
                        style={{
                            margin: "1rem 1rem 1rem auto",
                            width: "25%",
                            minWidth: "15rem",
                        }}
                    >
                        <Button type={"submit"}>
                            提交
                        </Button>
                    </FormItem>
                </Form>
            </FieldsetContainer>
            <div className="user-center-introduction-action-group">

            </div>
            <Loading visible={loadingVisible}/>
        </div>
    );
};

export default PersonalHomeSetting;