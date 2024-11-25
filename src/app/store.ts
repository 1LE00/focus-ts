import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";
import soundReducer from '../features/sounds/soundSlice';
import timerReducer from '../features/timer/timerSlice';
import sessionReducer from '../features/session/sessionSlice';
import progressbarReducer from '../features/progressbar/progressbarSlice';
import settingsReducer from "../features/settings/settingsSlice";
import databaseReducer from "../features/database/DatabaseSlice";
import taskReducer from "../features/tasks/taskSlice";
import floatingActionButtonReducer from "../features/FloatingActionButton/FloatingActionButtonSlice";
import tagReducer from "../features/tags/tagSlice";
import projectReducer from "../features/projects/projectSlice";
import toastReducer from "../features/toasts/toastSlice";


export const store = configureStore({
    reducer: {
        theme: themeReducer,
        sound: soundReducer,
        timer: timerReducer,
        session: sessionReducer,
        progressbar: progressbarReducer,
        settings: settingsReducer,
        database: databaseReducer,
        tasks: taskReducer,
        tags: tagReducer,
        projects: projectReducer,
        floatingActionButton: floatingActionButtonReducer,
        toasts: toastReducer,
    },
    // * Had issues during initial configuration, so added this
    // * Look up serialization
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: [
                    'database/initialize/fulfilled',
                    'database/fetchConfigData/fulfilled'
                ],
                ignoredPaths: ['database.db']
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;