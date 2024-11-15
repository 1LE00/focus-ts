import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store';
type SessionCount = {
    focus: number,
    break: number
};

interface sessionState {
    sessionCount: SessionCount,
}

const initialState: sessionState = {
    sessionCount: {
        focus: 1,
        break: 1
    }
}

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        changeSessionCount: (state, action: PayloadAction<SessionCount>) => {
            state.sessionCount = action.payload
        }
    }
});

export const { changeSessionCount } = sessionSlice.actions
export const selectSessionCount = (state: RootState) => state.session.sessionCount

export default sessionSlice.reducer