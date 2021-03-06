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
        showToast("?????????????????????", "warn")
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
            normalOnlineTime: normalOnlineTime.id === 0 ? "??????" : "??????",
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
                        showToast("????????????")
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
            <FieldsetContainer title={"????????????"}>
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
                            required: {value: true, tips: "??????????????????"},
                        }}
                    >
                        <WithLabel label={"??????"} formItemModel={true}>
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
                            required: {value: true, tips: "??????????????????"},
                        }}
                    >
                        <WithLabel label={"??????"} formItemModel={true}>
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
                            required: {value: true, tips: "??????????????????"},
                        }}
                    >
                        <WithLabel label={"??????"} formItemModel={true}>
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
                            required: {value: true, tips: "????????????????????????"},
                        }}
                    >
                        <WithLabel label={"????????????"} formItemModel={true}>
                            {returnInput(data.gameRoleName, "????????????")}
                        </WithLabel>
                    </FormItem>
                    <FormItem
                        label={"selfIntroduction"}
                        name={"selfIntroduction"}
                        reload={[data.selfIntroduction]}
                        condition={{
                            max: {value: 50, tips: "??????50??????"}
                        }}
                    >
                        <WithLabel label={"??????"} formItemModel={true}>
                            {returnInput(data.selfIntroduction, "??????", true)}
                        </WithLabel>
                    </FormItem>
                    <FormItem
                        label={"sns"}
                        name={"sns"}
                        reload={[data.sns]}
                        condition={{
                            max: {value: 20, tips: "??????20??????"}
                        }}
                    >
                        <WithLabel label={"????????????"} formItemModel={true}>
                            {returnInput(data.sns, "????????????")}
                        </WithLabel>
                    </FormItem>
                </Form>
            </FieldsetContainer>
            <FieldsetContainer title={"?????????????????????"}>
                <WithLabel label={"?????????????????????"}/>
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
                            required: {value: true, tips: "??????????????????????????????"},
                        }}
                    >
                        <WithLabel label={"????????????"} formItemModel={true}>
                            <SelectedCareer initializeData={{
                                mainCareerId: data.favoriteCareerId,
                                careerIdList: data.careerIdArray
                            }} careerList={career}/>
                        </WithLabel>
                    </FormItem>
                </Form>
            </FieldsetContainer>
            <FieldsetContainer title={"??????"}>
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
                            required: {value: true, tips: "????????????????????????"},
                        }}
                    >
                        <WithLabel label={"????????????"} formItemModel={true}>
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
                            required: {value: true, tips: "????????????????????????"},
                        }}
                    >
                        <WithLabel label={"????????????"} formItemModel={true}>
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
            <FieldsetContainer title={"??????????????????"}>
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
                            required: {value: true, tips: "???????????????????????????"},
                        }}
                    >
                        <WithLabel label={"???????????????"} formItemModel={true}>
                            <TiledSelectedList
                                initializeData={{
                                    id: data.normalOnlineTime ?
                                        data.normalOnlineTime === "??????" ? 0 : 1 : -1
                                }}
                                list={[{id: 0, name: "??????"}, {id: 1, name: "??????"}]}
                            />
                        </WithLabel>
                    </FormItem>
                    <FormItem
                        label={"preciseOnlineTime"}
                        name={"preciseOnlineTime"}
                        reload={[data.preciseOnlineTime]}
                        condition={{
                            required: {value: true, tips: "???????????????????????????"},
                        }}
                    >
                        <WithLabel label={"???????????????(??????)"} formItemModel={true}>
                            <TiledSelectedList
                                initializeData={{list: data.preciseOnlineTime}}
                                list={[
                                    {id: 1, name: "?????????"}, {id: 2, name: "?????????"},
                                    {id: 3, name: "?????????"}, {id: 4, name: "?????????"},
                                    {id: 5, name: "?????????"}, {id: 6, name: "?????????"},
                                    {id: 7, name: "?????????"}
                                ]}
                                model={"list"}
                            />
                        </WithLabel>
                    </FormItem>
                </Form>
            </FieldsetContainer>
            <FieldsetContainer title={"??????"}>
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
                            required: {value: true, tips: "??????????????????"},
                        }}
                    >
                        <WithLabel label={"????????????(????????????????????????)"} formItemModel={true}>
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
            <FieldsetContainer title={"??????"}>
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
                            required: {value: true, tips: "????????????????????????"},
                        }}
                    >
                        <WithLabel label={"????????????"} formItemModel={true}>
                            <TiledSelectedList
                                initializeData={{
                                    id: data.isVisible
                                }}
                                list={[{id: 0, name: "?????????"}, {id: 1, name: "??????"}]}
                            />
                        </WithLabel>
                    </FormItem>
                    <FormItem
                        label={"isSocial"}
                        name={"isSocial"}
                        reload={[data.isSocial]}
                        condition={{
                            required: {value: true, tips: "????????????????????????"},
                        }}
                    >
                        <WithLabel label={"????????????"} formItemModel={true}>
                            <TiledSelectedList
                                initializeData={{
                                    id: data.isSocial
                                }}
                                list={[{id: 0, name: "?????????"}, {id: 1, name: "??????"}]}
                            />
                        </WithLabel>
                    </FormItem>
                </Form>
            </FieldsetContainer>
            <div className="user-center-introduction-action-group">
                <Button
                    onClick={submit}
                >
                    ??????
                </Button>
            </div>
            <Loading visible={loadingVisible}/>
        </div>
    );
};

export default Introduction;