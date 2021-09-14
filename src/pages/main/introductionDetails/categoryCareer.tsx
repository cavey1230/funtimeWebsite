import React, {useCallback} from 'react';
import {battleImgAddress, traderImgAddress} from "@/assets/img/returnImgByNam";
import classnames from "@/utils/classnames";

import "./categoryCareer.less";

interface Props {
    width: string
    careerList: Array<any>
    selectedList: Array<any>
}

export const getCareerImg = (name: string) => {
    const result1 = battleImgAddress(name)
    return result1.length > 0 ? result1 :
        traderImgAddress(name)
}

export const CategoryCareer: React.FC<Props> = (props) => {
    const {careerList, selectedList, width} = props
    //取得分类后的职业二维数组
    const getDetailsCategoryCareer = useCallback((initializeArray: Array<any>) => {
        //排序
        const careerByOrderNumList = initializeArray.sort((item1, item2) => {
            return item1.orderNum - item2.orderNum
        })
        //取得下标
        const categoryCareer = () => {
            let innerSecondCategory = "坦克"
            let innerFirstCategory = "战斗职业"
            return careerByOrderNumList.map((item, index) => {
                const innerOrderNum = index > 0 ? careerByOrderNumList[index - 1].orderNum : 0
                if (item.firstCategory !== innerFirstCategory) {
                    innerFirstCategory = item.firstCategory
                    innerSecondCategory = ""
                    return innerOrderNum
                }
                if (item.secondCategory !== innerSecondCategory) {
                    innerSecondCategory = item.secondCategory
                    return innerOrderNum
                }
            }).filter(i => i)
        }
        //取得二维数组
        const categoryArray = categoryCareer()
        let initializeIndex = 0
        const result = categoryArray.map((item) => {
            const arr = careerByOrderNumList.slice(initializeIndex, item)
            initializeIndex = item
            return arr
        })
        // 添加最后下标后的数组
        result.push(careerByOrderNumList.slice(categoryArray[categoryArray.length - 1]))
        return result
    }, [])

    const renderCareerCategory = useCallback((careerList: Array<any>, selectedList: Array<any>) => {
        const innerSelectedList = selectedList ? selectedList : []
        return careerList && getDetailsCategoryCareer(careerList)?.map((item: any, index) => {
            return <div className="career-first-category" key={index}>
                {item.map((item2: any) => {
                    const {id, name} = item2
                    return <div className={
                        classnames("career-details-item", {
                            "selected": innerSelectedList.includes(id)
                        })
                    } key={id}>
                        <img src={getCareerImg(name)} alt={`career_icon_${id}`}/>
                    </div>
                })}
            </div>
        })
    }, [])

    return <div className="career-info-item" style={{width}}>
        {renderCareerCategory(careerList, selectedList)}
    </div>
};