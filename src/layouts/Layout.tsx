import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { selectTheme } from "../features/theme/themeSlice";
import { selectActiveButton, selectTracker } from "../features/timer/timerSlice";
import { selectDarkTheme } from "../features/settings/settingsSlice";
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { selectDatabase, selectFetchStatus } from "../features/database/DatabaseSlice"
import { fetchAndSyncConfigData, initializeDatabase } from "../features/database/Thunks"

export default function Layout() {
    const theme = useAppSelector(selectTheme);
    const activeButton = useAppSelector(selectActiveButton);
    const { isActive } = useAppSelector(selectTracker);
    const darkTheme = useAppSelector(selectDarkTheme);
    type MapButton = {
        [key: number]: string
    }
    const map: MapButton = {
        1: theme.focus,
        2: theme.short,
        3: theme.long,
    };
    const dispatch = useAppDispatch();
    // * Database related effects and constants
    const db = useAppSelector(selectDatabase);
    const status = useAppSelector(selectFetchStatus);

    useEffect(() => {
        dispatch(initializeDatabase())
    }, [dispatch])

    useEffect(() => {
        if (db) {
            dispatch(fetchAndSyncConfigData())
        }
    }, [db, dispatch])

    return (status === 'succeeded' &&
        <section
            className={`focus-app bg-${darkTheme && isActive ? theme.dark : map[activeButton]
                } min-h-screen p-3 flex flex-col items-center w-100 transition ease duration-1000`}
        >
            <Header />
            <Outlet />
        </section>
    );
}
