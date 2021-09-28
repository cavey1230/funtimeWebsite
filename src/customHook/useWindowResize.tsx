import React, {useCallback, useEffect} from 'react';
import {useDispatch} from "react-redux";
import {updateWindowResizeStatus} from "@/redux/windowResizeReducer";

const useWindowResize = () => {

    const dispatch = useDispatch()

    const resize = useCallback(() => {
        if (window.innerWidth < 576) {
            localStorage.setItem("isMobile", "true")
            dispatch(updateWindowResizeStatus({
                isMobile: true
            }))
        } else {
            localStorage.setItem("isMobile", "false")
            dispatch(updateWindowResizeStatus({
                isMobile: false
            }))
        }
    }, [])

    useEffect(() => {
        resize()
        window.addEventListener("", resize)
        return () => {
            window.removeEventListener("resize", resize)
        }
    }, [])
};

export default useWindowResize;