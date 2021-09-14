import React, {useState} from 'react';

import "./thumbnailImg.less";
import ImgModal from "@/pages/main/publicComponent/imgModal";

interface Props {
    imgArray: Array<string>
}

const ThumbnailImg: React.FC<Props> = (props) => {
    const {imgArray} = props

    const [imgVisible, setImgVisible] = useState(false)

    const [selectedImgIndex, setSelectedImgIndex] = useState(0)

    return <div className="thumbnail-container">
        <fieldset className="thumbnail-fieldset">
            <legend style={{padding: "0 1rem"}}>个人图集</legend>
            {imgArray?.map((item: string,index) => {
                return <div key={index} onClick={()=>{
                    setSelectedImgIndex(index)
                    setImgVisible(true)
                }}>
                    <img src={item} alt="imgArray"/>
                </div>
            })}
        </fieldset>
        {imgArray?.length > 0 && <ImgModal
            visible={imgVisible}
            setVisible={() => {
                setImgVisible(false)
            }}
            imgArray={imgArray}
            initializeImgIndex={selectedImgIndex}
        />}
    </div>
};

export default ThumbnailImg;