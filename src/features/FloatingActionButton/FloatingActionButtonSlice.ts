import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store';

interface FloatingActionButton {
    toggleFloatingActionButton: boolean
}

const initialState: FloatingActionButton = {
    toggleFloatingActionButton: false
}

const FloatingActionButtonSlice = createSlice({
    name: 'floatingActionButton',
    initialState,
    reducers: {
        toggleFloatingActionButtonModal: (state) => {
            state.toggleFloatingActionButton = !state.toggleFloatingActionButton
        }
    }
});

export const { toggleFloatingActionButtonModal } = FloatingActionButtonSlice.actions

export const selectFABModalState = (state: RootState) => state.floatingActionButton.toggleFloatingActionButton

export default FloatingActionButtonSlice.reducer