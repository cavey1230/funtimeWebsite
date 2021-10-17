import React, {useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {showToast} from "@/utils/lightToast";

const UseShortcutKey = () => {
    const history = useHistory()

    const keyObject = {
        "ctrl+z": () => {
            history.goBack()
        }
    }

    const shortcutKey = (key: keyof typeof keyObject) => {
        const keyData = keyObject[key]
        const type = typeof keyObject[key]
        if (type === "function") {
            keyObject[key]()
        } else if (type === "object" && Array.isArray(keyData)) {
            keyData.length > 0 && keyData.map(item => {
                item()
            })
        } else {
            showToast("无此快捷键")
        }
    }

    const bindWindow = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key == "z") {
            shortcutKey("ctrl+z")
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", bindWindow)
        return () => {
            document.removeEventListener("keydown", bindWindow)
        }
    }, [])
};

export default UseShortcutKey;