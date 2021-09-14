import React from 'react';
import classnames from "@/utils/classnames";
import {getNameById} from "@/pages/main/introduction/introductionList";

import "./propertyInfo.less";

interface Props {
    propertyList: Array<any>
    propertyIdArray: Array<number>
    propertyRangeArray: Array<number>
}

const PropertyInfo: React.FC<Props> = (props) => {
    const {propertyList, propertyIdArray, propertyRangeArray} = props

    const renderPropertyList = (propertyIdArray: Array<any>, propertyRangeArray: Array<any>) => {
        const fillContent = (fillLength: number) => {
            const maxLength = 6
            return new Array(maxLength).fill("").map((item, index) => {
                return <div key={index} className={classnames(
                    "property-info-content-fill-item",
                    {"fill-item-selected": index + 1 <= fillLength}
                )}/>
            })
        }

        return propertyIdArray?.map((item, index) => {
            return <div key={index} className="property-info-item">
                <div className="label">
                    {getNameById(propertyList, item)}
                </div>
                <div className="content">
                    {fillContent(propertyRangeArray[index])}
                </div>
            </div>
        })
    }

    return <div className="property-info-group">
        <fieldset className="property-info-field">
            <legend style={{padding: "0 1rem"}}>游戏属性</legend>
            {renderPropertyList(propertyIdArray, propertyRangeArray)}
        </fieldset>
    </div>

};

export default PropertyInfo;