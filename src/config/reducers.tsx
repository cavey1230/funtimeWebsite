import {combineReducers} from "redux";

import {skinChangeReducer} from "@/redux/skinChangeReducer";
import {windowResizeReducer} from "@/redux/windowResizeReducer";
import {noReadMessageReducer} from "@/redux/noReadMessageReducer";

export const com = combineReducers({
    skinChangeReducer,
    windowResizeReducer,
    noReadMessageReducer,
})

export type ReduxRootType = ReturnType<typeof com>