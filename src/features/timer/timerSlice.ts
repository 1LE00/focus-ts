import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store';

// * The Minutes interface holds the duration of each session type(focus, short break, long break) in minutes
export interface Minutes {
    focus: number,
    short: number,
    long: number
}

// * The ChangesIn interface Track changes in user preferences settings(minutes) for specific session
export interface ChangesIn {
    focus: boolean,
    short: boolean,
    long: boolean
}
/*  
    * The Tracker interface holds the current status of the timer (active, paused)
    * didTimerRun is used to automate breaks and focus session, returns true if the timer has run once
*/
interface Tracker {
    didTimerRun: boolean,
    isPaused: boolean,
    isActive: boolean
}
// * Total duration is used as initial value for progressbar
interface timerState {
    activeButton: number,
    minutes: Minutes,
    changesIn: ChangesIn,
    tracker: Tracker,
    totalDuration: number
}

const initialState: timerState = {
    activeButton: 1,
    minutes: {
        focus: 25,
        short: 5,
        long: 15
    },
    changesIn: {
        focus: false,
        short: false,
        long: false
    },
    tracker: {
        didTimerRun: false,
        isActive: false,
        isPaused: false
    },
    totalDuration: 25
}
/*  
    * `buttonConfigs` defines the three buttons corresponding to the timer's session types:
    * - Focus (session 1)
    * - Short Break (session 2)
    * - Long Break (session 3)
    * - Each button is associated with an ID and a title to represent the session type
    * - Used for creating TimerButton component 
*/

type ButtonConfig = {
    id: number,
    title: string
}

export const buttonConfigs: ButtonConfig[] = [
    { id: 1, title: 'Focus' },
    { id: 2, title: 'Short Break' },
    { id: 3, title: 'Long Break' },
]

const timerSlice = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        setActiveButton: (state, action: PayloadAction<number>) => {
            state.activeButton = action.payload;
            state.totalDuration = state.activeButton === 1 ? state.minutes.focus :
                state.activeButton === 2 ? state.minutes.short :
                    state.minutes.long;
        },
        setMinutes: (state, action: PayloadAction<Partial<Minutes>>) => {
            state.minutes = { ...state.minutes, ...action.payload }
        },
        setMinutesFromConfig: (state, action: PayloadAction<Minutes>) => {
            state.minutes = action.payload;
        },
        setChangesIn: (state, action: PayloadAction<ChangesIn>) => {
            state.changesIn = action.payload
        },
        setTracker: (state, action: PayloadAction<Partial<Tracker>>) => {
            state.tracker = { ...state.tracker, ...action.payload }
        },

    }
});

export const selectActiveButton = (state: RootState) => state.timer.activeButton;
export const selectTracker = (state: RootState) => state.timer.tracker;
export const selectMinutes = (state: RootState) => state.timer.minutes;

export const {
    setActiveButton,
    setTracker,
    setMinutes,
    setMinutesFromConfig,
    setChangesIn,
} = timerSlice.actions

export default timerSlice.reducer