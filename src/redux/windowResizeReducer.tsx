import useLocalStorage from "@/customHook/useLocalStorage";

const [getLocalStorage] = useLocalStorage()

interface Data {
    isMobile: boolean
}

export const WINDOW_RESIZE = {
    UPDATE_WINDOW_RESIZE_STATUS: "UPDATE_WINDOW_RESIZE_STATUS"
}

export const windowResizeReducer = (
    state: Data = {isMobile: getLocalStorage("isMobile")},
    action: { type: string, data: Data }
) => {
    const {data, type} = action
    switch (type) {
        case WINDOW_RESIZE.UPDATE_WINDOW_RESIZE_STATUS:
            return data
        default:
            return state
    }
}

export const updateWindowResizeStatus = (data: Data) => ({
    type: WINDOW_RESIZE.UPDATE_WINDOW_RESIZE_STATUS,
    data: data
})