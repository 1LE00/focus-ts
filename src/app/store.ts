import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";
import soundReducer from '../features/sounds/soundSlice';
import timerReducer from '../features/timer/timerSlice';
import sessionReducer from '../features/session/sessionSlice';
import progressbarReducer from '../features/progressbar/progressbarSlice';
import settingsReducer from "../features/settings/settingsSlice";


export const store = configureStore({
    reducer: {
        theme: themeReducer,
        sound: soundReducer,
        timer: timerReducer,
        session: sessionReducer,
        progressbar: progressbarReducer,
        settings: settingsReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;