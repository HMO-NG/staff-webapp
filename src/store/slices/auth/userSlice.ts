import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
    user_id?: string
    first_name?: string
    last_name?: string
    email?: string
    authority?: string[]
}

const initialState: UserState = {
    user_id: '',
    first_name: '',
    last_name: '',
    email: '',
    authority: [],
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.user_id = action.payload?.user_id
            state.email = action.payload?.email
            state.first_name = action.payload?.first_name
            state.last_name = action.payload?.last_name
            state.authority = action.payload?.authority
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
