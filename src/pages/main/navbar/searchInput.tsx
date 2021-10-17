import React, {useRef, useState} from 'react';
import Input from "@/basicComponent/Input";
import Button from "@/basicComponent/Button";
import {useHistory} from "react-router-dom";
import {AllSearchIcon} from "@/assets/icon/iconComponent";
import classnames from '@/utils/classnames';

import "./searchInput.less";

const SearchInput = () => {
    const [value, setValue] = useState("111")

    const [expand, setExpand] = useState(false)

    const inputRef = useRef(null)

    const history = useHistory()

    const handleClick = () => {
        if (!value) return
        history.push(`/main/search/${value}`)
        inputRef.current.setValue("")
    }

    return (
        <div className={classnames("search-container", {
            "search-container-focus": expand
        })}>
            <div className="action-container" style={{
                width: expand ? "100%" : "0",
            }}>
                <Button
                    style={{width: "6rem", wordBreak: "keep-all"}}
                    onClick={handleClick}
                >
                    搜索
                </Button>
                <Input
                    ref={inputRef}
                    placeholder={"请输入"}
                    style={{border: "none"}}
                    noFocusStyle={true}
                    onChange={(result: string) => {
                        setValue(result)
                    }}
                    onKeyDown={(event) => {
                        event.key === "Enter" && handleClick()
                    }}
                />
            </div>
            <div className="search-icon" onClick={() => {
                setExpand(prev => !prev)
            }}>
                <AllSearchIcon/>
            </div>
        </div>
    );
};

export default SearchInput;