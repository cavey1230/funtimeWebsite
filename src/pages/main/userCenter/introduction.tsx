import React, {useEffect, useState} from 'react';

import useGetNameList from "@/customHook/useGetNameList";
import FieldsetContainer from "@/pages/main/userCenter/publicComponent/fieldsetContainer";
import WithLabel from './publicComponent/withLabel';
import ServerAndArea from "@/pages/main/userCenter/introoductionCom/serverAndArea";
import Button from "@/basicComponent/Button";
import {Form, FormItem} from "@/basicComponent/Form";
import Input from "@/basicComponent/Input";
import TiledSelectedList from "@/pages/main/userCenter/introoductionCom/tiledSelectedList";
import SelectedCareer from "@/pages/main/userCenter/introoductionCom/selectedCareer";
import Upload from "@/basicComponent/Upload";
import SelectedProperty from "@/pages/main/userCenter/introoductionCom/selectedProperty";
import {createAndUpdateIntroductionData, getOneIntroduction} from "@/api/v1/introduction";
import useLocalStorage from "@/customHook/useLocalStorage";
import Loading from "@/basicComponent/Loading";
import getDom from '@/utils/getDom';
import {showToast} from "@/utils/lightToast";
import useUploadImg from "@/customHook/useUploadImg";

import "./introduction.less";
import CropMainImg from "@/pages/main/userCenter/introoductionCom/cropMainImg";
import UploadAndCrop from "@/pages/main/userCenter/introoductionCom/uploadAndCrop";

const Introduction = () => {
    const [data, setData] = useState({
        role: -1,
        race: -1,
        favoriteCareerId: 0,
        careerIdArray: [] as number[],
        imgArray: [] as string[],
        mainImg: "",
        server: 0,
        normalOnlineTime: "",
        preciseOnlineTime: [] as number[],
        area: 0,
        gameRoleName: "",
        sns: "",
        selfIntroduction: "",
        propertyIdArray: [] as number[],
        propertyRangeArray: [] as number[],
        isVisible: 0,
        isSocial: 0,
        userId: 0,
        id: 0
    })

    const [loadingVisible, setLoadingVisible] = useState(false)

    const refList: Form[] = []

    const nameList = useGetNameList()

    const [getLocalStorage] = useLocalStorage()

    const userId = getLocalStorage("userId")

    const uploadImg = useUploadImg()

    useEffect(() => {
        setLoadingVisible(true)
        getOneIntroduction({userId}).then(res => {
            setLoadingVisible(false)
            res.status === 200 && setData(res.data)
        })
    }, [])

    const scrollTo = (index: number) => {
        const dom = refList[index].containerRef
        const offsetTop = dom.current.offsetTop
        showToast("表单未填写完整", "warn")
        getDom("user-center-content-container").scrollTo({
            top: offsetTop,
            behavior: "smooth"
        })
    }

    const submit = () => {
        const result = refList.reduce((store, next, index) => {
            const data = next.submit()
            if (data.warning) {
                store.warnLength++
                store.index < 0 && (store.index = index)
            }
            store.data = {...store.data, ...data}
            return store
        }, {index: -1, data: {}, warnLength: 0})

        const {warnLength, index, data: innerData} = result

        if (warnLength > 0) {
            scrollTo(index)
            return
        }

        const {
            career, gameRoleName, race, role,
            selfIntroduction, sns, serverAndArea,
            normalOnlineTime, preciseOnlineTime,
            propertyArray, mainImg, imgArray,
            isVisible, isSocial
        } = innerData as { [key: string]: any }

        const fetchData = {
            role: role.id,
            race: race.id,
            gameRoleName, selfIntroduction,
            sns, userId,
            favoriteCareerId: career.mainCareerId,
            careerIdArray: career.careerIdList,
            imgArray: [] as string[],
            mainImg: "",
            server: serverAndArea.server,
            normalOnlineTime: normalOnlineTime.id === 0 ? "白天" : "晚上",
            preciseOnlineTime: preciseOnlineTime.list,
            area: serverAndArea.area,
            propertyIdArray: propertyArray.selectedPropertyId,
            propertyRangeArray: propertyArray.selectedPropertyWithRange,
            isVisible: isVisible.id,
            isSocial: isSocial.id
        }

        mainImg.length > 0 && uploadImg(mainImg, (result) => {
            fetchData.mainImg = result[0]
            imgArray.length > 0 && uploadImg(imgArray, (result2) => {
                fetchData.imgArray = result2
                createAndUpdateIntroductionData(fetchData).then(res => {
                    if (res.status === 200) {
                        showToast("提交成功")
                        setData(res.data)
                    }
                })
            })
        })
    }

    const returnInput = (
        initializeValue: string,
        placeholder: string,
        textAreaModel?: boolean
    ) => {
        const style = {
            minWidth: "20rem",
            width: "100%",
            height: "6rem"
        }
        const textAreaModelStyle = {
            border: "0.2rem solid var(--font-color)",
            padding: "1rem",
            borderRadius: "1rem",
            height: "unset"
        }
        return <Input
            width={"50%"}
            style={textAreaModel ? {...style, ...textAreaModelStyle} : style}
            textAreaMode={textAreaModel}
            noFocusStyle={true}
            initializeValue={initializeValue}
            placeholder={placeholder}
        />
    }

    const {server, area, role, career, race, property} = nameList

    return (
        <div className="user-center-introduction-container">
            <FieldsetContainer title={"基本资料"}>
                <Form
                    ref={(ref) => {
                        refList.push(ref)
                    }}
                    reload={[server, area, role]}
                >
                    <FormItem
                        label={"serverAndArea"}
                        name={"serverAndArea"}
                        reload={[server, area, data.server, data.area]}
                        condition={{
                            required: {value: true, tips: "区服为必选项"},
                        }}
                    >
                        <WithLabel label={"区服"} formItemModel={true}>
                            <ServerAndArea
                                areaList={area}
                                serverList={server}
                                initializeIdArray={[data.server, data.area]}
                            />
                        </WithLabel>
                    </FormItem>
                    <FormItem
                        label={"role"}
                        name={"role"}
                        reload={[role, data.role]}
                        condition={{
                            required: {value: true, tips: "身份为必选项"},
                        }}
                    >
                        <WithLabel label={"身份"} formItemModel={true}>
                            <TiledSelectedList
                                list={role}
                                showIcon={true}
                                initializeData={{id: data.role}}
                            />
                        </WithLabel>
                    </FormItem>
                    <FormItem
                        label={"race"}
                        name={"race"}
                        reload={[race]}
                        condition={{
                            required: {value: true, tips: "种族为必选项"},
                        }}
                    >
                        <WithLabel label={"种族"} formItemModel={true}>
                            <TiledSelectedList
                                list={race}
                                initializeData={{id: data.race}}
                            />
                        </WithLabel>
                    </FormItem>
                    <FormItem
                        label={"gameRoleName"}
                        name={"gameRoleName"}
                        reload={[data.gameRoleName]}
                        condition={{
                            required: {value: true, tips: "角色名称为必填项"},
                        }}
                    >
                        <WithLabel label={"角色名称"} formItemModel={true}>
                            {returnInput(data.gameRoleName, "角色名称")}
                        </WithLabel>
                    </FormItem>
                    <FormItem
                        label={"selfIntroduction"}
                        name={"selfIntroduction"}
                        reload={[data.selfIntroduction]}
                        condition={{
                            max: {value: 50, tips: "最大50字符"}
                        }}
                    >
                        <WithLabel label={"简介"} formItemModel={true}>
                            {returnInput(data.selfIntroduction, "简介", true)}
                        </WithLabel>
                    </FormItem>
                    <FormItem
                        label={"sns"}
                        name={"sns"}
                        reload={[data.sns]}
                        condition={{
                            max: {value: 20, tips: "最大20字符"}
                        }}
                    >
                        <WithLabel label={"社交账号"} formItemModel={true}>
                            {returnInput(data.sns, "社交账号")}
                        </WithLabel>
                    </FormItem>
                </Form>
            </FieldsetContainer>
            <FieldsetContainer title={"游戏内职业选择"}>
                <WithLabel label={"单击选择主职业"}/>
                <Form
                    ref={(ref) => {
                        refList.push(ref)
                    }}
                    reload={[career]}
                >
                    <FormItem
                        label={"career"}
                        name={"career"}
                        reload={[career, data.favoriteCareerId, data.careerIdArray]}
                        condition={{
                            required: {value: true, tips: "职业与主职业必选一个"},
                        }}
                    >
                        <WithLabel label={"职业列表"} formItemModel={true}>
                            <SelectedCareer initializeData={{
                                mainCareerId: data.favoriteCareerId,
                                careerIdList: data.careerIdArray
                            }} careerList={career}/>
                        </WithLabel>
                    </FormItem>
                </Form>
            </FieldsetContainer>
            <FieldsetContainer title={"图集"}>
                <Form
                    ref={(ref) => {
                        refList.push(ref)
                    }}
                    reload={[career, data]}
                >
                    <FormItem
                        label={"mainImg"}
                        name={"mainImg"}
                        reload={[data.mainImg]}
                        condition={{
                            required: {value: true, tips: "人物主图为必选项"},
                        }}
                    >
                        <WithLabel label={"人物主图"} formItemModel={true}>
                            <UploadAndCrop
                                mainImg={data.mainImg}
                            />
                        </WithLabel>
                    </FormItem>
                    <FormItem
                        label={"imgArray"}
                        name={"imgArray"}
                        reload={[data.imgArray]}
                        condition={{
                            required: {value: true, tips: "个人图集为必选项"},
                        }}
                    >
                        <WithLabel label={"个人图集"} formItemModel={true}>
                            <Upload
                                initializeFileUrlList={data.imgArray}
                                multiple={true}
                                maxFileLength={5}
                                acceptFileType={"image/png,image/jpeg"}
                            />
                        </WithLabel>
                    </FormItem>
                </Form>
            </FieldsetContainer>
            <FieldsetContainer title={"在线时间选择"}>
                <Form
                    ref={(ref) => {
                        refList.push(ref)
                    }}
                    reload={[data]}
                >
                    <FormItem
                        label={"normalOnlineTime"}
                        name={"normalOnlineTime"}
                        reload={[data.normalOnlineTime]}
                        condition={{
                            required: {value: true, tips: "日在线时间为必选项"},
                        }}
                    >
                        <WithLabel label={"日在线时间"} formItemModel={true}>
                            <TiledSelectedList
                                initializeData={{
                                    id: data.normalOnlineTime ?
                                        data.normalOnlineTime === "白天" ? 0 : 1 : -1
                                }}
                                list={[{id: 0, name: "白天"}, {id: 1, name: "晚上"}]}
                            />
                        </WithLabel>
                    </FormItem>
                    <FormItem
                        label={"preciseOnlineTime"}
                        name={"preciseOnlineTime"}
                        reload={[data.preciseOnlineTime]}
                        condition={{
                            required: {value: true, tips: "周在线时间为必选项"},
                        }}
                    >
                        <WithLabel label={"周在线时间(多选)"} formItemModel={true}>
                            <TiledSelectedList
                                initializeData={{list: data.preciseOnlineTime}}
                                list={[
                                    {id: 1, name: "星期一"}, {id: 2, name: "星期二"},
                                    {id: 3, name: "星期三"}, {id: 4, name: "星期四"},
                                    {id: 5, name: "星期五"}, {id: 6, name: "星期六"},
                                    {id: 7, name: "星期天"}
                                ]}
                                model={"list"}
                            />
                        </WithLabel>
                    </FormItem>
                </Form>
            </FieldsetContainer>
            <FieldsetContainer title={"属性"}>
                <Form
                    ref={(ref) => {
                        refList.push(ref)
                    }}
                    reload={[property]}
                >
                    <FormItem
                        label={"propertyArray"}
                        name={"propertyArray"}
                        reload={[property, data.propertyIdArray, data.propertyRangeArray]}
                        condition={{
                            required: {value: true, tips: "属性为必选项"},
                        }}
                    >
                        <WithLabel label={"属性选择(点击标签清空范围)"} formItemModel={true}>
                            <SelectedProperty
                                initializeData={{
                                    selectedPropertyId: data.propertyIdArray,
                                    selectedPropertyWithRange: data.propertyRangeArray
                                }}
                                propertyList={property}
                            />
                        </WithLabel>
                    </FormItem>
                </Form>
            </FieldsetContainer>
            <FieldsetContainer title={"状态"}>
                <Form
                    ref={(ref) => {
                        refList.push(ref)
                    }}
                    reload={[data]}
                >
                    <FormItem
                        label={"isVisible"}
                        name={"isVisible"}
                        reload={[data.isVisible]}
                        condition={{
                            required: {value: true, tips: "是否展示为必选项"},
                        }}
                    >
                        <WithLabel label={"是否展示"} formItemModel={true}>
                            <TiledSelectedList
                                initializeData={{
                                    id: data.isVisible
                                }}
                                list={[{id: 0, name: "不展示"}, {id: 1, name: "展示"}]}
                            />
                        </WithLabel>
                    </FormItem>
                    <FormItem
                        label={"isSocial"}
                        name={"isSocial"}
                        reload={[data.isSocial]}
                        condition={{
                            required: {value: true, tips: "是否扩列为必选项"},
                        }}
                    >
                        <WithLabel label={"是否扩列"} formItemModel={true}>
                            <TiledSelectedList
                                initializeData={{
                                    id: data.isSocial
                                }}
                                list={[{id: 0, name: "不扩列"}, {id: 1, name: "扩列"}]}
                            />
                        </WithLabel>
                    </FormItem>
                </Form>
            </FieldsetContainer>
            <div className="user-center-introduction-action-group">
                <Button
                    onClick={submit}
                >
                    提交
                </Button>
            </div>
            <Loading visible={loadingVisible}/>
        </div>
    );
};

export default Introduction;