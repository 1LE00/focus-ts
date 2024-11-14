import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store';
type SessionCount = {
    focus: number,
    break: number
};

interface sessionState {
    sessionCount: SessionCount,
}

const getSessionCount = (key: string): number => {
    const value = localStorage.getItem(key);
    return value === null ? 1 : Number.parseInt(value);
}

const initialState: sessionState = {
    sessionCount: {
        focus: getSessionCount("Sessions Completed"),
        break: getSessionCount("Sessions Completed")
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