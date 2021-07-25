interface Data {
    total: number,
    data: Array<any>
}

export const SHOE_LIST_TYPES = {
    UPDATE_SHOE_LIST_ARR: "UPDATE_SHOE_LIST_ARR",
    INIT_SHOE_LIST_ARR: "INIT_SHOE_LIST_ARR"
}

export const shoeListReducer = (
    state: Data = {total: 0, data: []},
    action: { type: string, data: Data }
) => {
    const {data, type} = action
    switch (type) {
        case SHOE_LIST_TYPES.UPDATE_SHOE_LIST_ARR:
            return data
        case SHOE_LIST_TYPES.INIT_SHOE_LIST_ARR:
            return {total: 0, data: []}
        default:
            return state
    }
}

export const updateShoeList = (data: Data) => ({
    type: SHOE_LIST_TYPES.UPDATE_SHOE_LIST_ARR,
    data: data
})