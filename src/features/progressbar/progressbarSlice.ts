import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store';

const initialState: { progress: number } = {
    progress: 0
}

const progressbarSlice = createSlice({
    name: 'progressbar',
    initialState,
    reducers: {
        updateProgress: (state, action: PayloadAction<number>) => {
            if (state.progress >= 100) {
                state.progress = 100
            } else {
                state.progress = state.progress + action.payload
            }
        },
        setProgress: (state) => {
            state.progress = 0;
        }
    }
});

export const { updateProgress, setProgress } = progressbarSlice.actions
export const selectProgressBar = (state: RootState) => state.progressbar.progress

export default progressbarSlice.reducer