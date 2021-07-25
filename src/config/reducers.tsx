import {combineReducers} from "redux";

import {shoeListReducer} from "@/redux/shoeListReducer";


export const com = combineReducers({
    shoeListReducer
})

export type ReduxRootType = ReturnType<typeof com>