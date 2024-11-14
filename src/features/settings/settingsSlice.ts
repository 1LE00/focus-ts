import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store';

/*
    * Autostart - Determines if the timer should automatically start when transitioning between sessions. 
      - `focus: If true, the focus timer will start automatically.
      - `break`: If true, the break timer will start automatically after a focus session.

    * Toggle - Controls the visibility of modals for settings and reports.
      - `reports`: If true, the report modal is visible.
      - `settings`: If true, the settings modal is visible.

    * Notifications - Controls the behavior of notifications during the timer.
      - `enabled`: If true, notifications are enabled.
      - `silent`: If true, notifications are silent (i.e., no sound).

    * Dark Theme - Controls whether the app should use dark theme while running.
      - `darkTheme`: If true, the app will use the dark theme.

    * Long Break Interval - Defines the interval after which a long break will be triggered (e.g., every 4 focus sessions).
      - `longBreakInterval`: The number of focus sessions after which a long break will be triggered. This could be a number (e.g., 4) or a string (e.g., "4").
*/

type Autostart = {
    focus: boolean,
    break: boolean
}
type ToggleOptions = {
    reports: boolean,
    settings: boolean
};

type NotificationOptions = {
    enabled: boolean,
    silent: boolean
}

interface settingsState {
    autoStart: Autostart,
    toggle: ToggleOptions,
    notificationOptions: NotificationOptions,
    darkTheme: boolean,
    longBreakInterval: number | string
}

const initialState: settingsState = {
    autoStart: {
        focus: false,
        break: false
    },
    toggle: {
        reports: false,
        settings: false
    },
    notificationOptions: {
        enabled: false,
        silent: false
    },
    darkTheme: false,
    longBreakInterval: 4
}

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setAutoStart: (state, action: PayloadAction<Partial<Autostart>>) => {
            state.autoStart = { ...state.autoStart, ...action.payload }
        },
        setToggle: (state, action: PayloadAction<ToggleOptions>) => {
            state.toggle = action.payload
        },
        setNotificationOptions: (state, action: PayloadAction<Partial<NotificationOptions>>) => {
            state.notificationOptions = { ...state.notificationOptions, ...action.payload }
        },
        setDarkTheme: (state, action: PayloadAction<boolean>) => {
            state.darkTheme = action.payload
        },
        setLongBreakInterval: (state, action: PayloadAction<number | string>) => {
            state.longBreakInterval = action.payload
        },
    }
});

export const { setAutoStart, setToggle, setNotificationOptions, setDarkTheme, setLongBreakInterval } = settingsSlice.actions
export const selectAutoStart = (state: RootState) => state.settings.autoStart;
export const selectToggle = (state: RootState) => state.settings.toggle;
export const selectDarkTheme = (state: RootState) => state.settings.darkTheme;
export const selectNotificationOptions = (state: RootState) => state.settings.notificationOptions;
export const selectLongBreakInterval = (state: RootState) => state.settings.longBreakInterval;
export default settingsSlice.reducer