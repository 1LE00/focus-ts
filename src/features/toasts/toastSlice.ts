import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store';

export interface ToastMessage {
    type: string,
    info: string,
    color: string
}
export interface Toasts {
    message: ToastMessage;
    show: boolean;
}
const initialState: Toasts = {
    message: {
        type: '',
        info: '',
        color: ''
    },
    show: false,
}

const toastSlice = createSlice({
    name: 'toasts',
    initialState,
    reducers: {
        setToastMessage: (state, action: PayloadAction<ToastMessage>) => {
            state.message = action.payload;
            state.show = true
        },
        clearToastMessage: (state) => {
            state.show = false;
        }
    }
});

export const { setToastMessage, clearToastMessage } = toastSlice.actions

export const selectShowToast = (state: RootState) => state.toasts.show;
export const selectToastMessage = (state: RootState) => state.toasts.message;
export default toastSlice.reducer