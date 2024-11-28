import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { selectTheme } from "../features/theme/themeSlice";
import {
  selectActiveButton,
  selectTracker,
} from "../features/timer/timerSlice";
import { selectDarkTheme } from "../features/settings/settingsSlice";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectDatabase,
  selectFetchStatus,
} from "../features/database/DatabaseSlice";
import {
  fetchAndSyncConfigData,
  fetchTagsOrProjectsAndSync,
  initializeDatabase,
} from "../features/database/Thunks";

export default function Layout() {
  const theme = useAppSelector(selectTheme);
  const activeButton = useAppSelector(selectActiveButton);
  const { isActive } = useAppSelector(selectTracker);
  const darkTheme = useAppSelector(selectDarkTheme);
  type MapButton = {
    [key: number]: string;
  };
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
    dispatch(initializeDatabase());
  }, [dispatch]);

  useEffect(() => {
    if (db) {
      dispatch(fetchAndSyncConfigData());
      dispatch(fetchTagsOrProjectsAndSync({ key: "tags" }));
      dispatch(fetchTagsOrProjectsAndSync({ key: "projects" }));
    }
  }, [db, dispatch]);

  return status === "loading" ? (
    <section
      className={`flex h-dvh w-full flex-col items-center justify-center bg-focus`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#fff"
        className="size-24"
      >
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
          clipRule="evenodd"
        />
      </svg>
      <p className="animate-pulse md:text-xl">Loading...</p>
    </section>
  ) : (
    <section
      className={`focus-app bg-${
        darkTheme && isActive ? theme.dark : map[activeButton]
      } w-100 relative flex min-h-screen flex-col items-center p-3 transition duration-500 ease-linear`}
    >
      <Header />
      <Outlet />
    </section>
  );
}
