import { useAppDispatch, useAppSelector } from "../app/hooks";
import Report from "../features/reports/Report";
import { Settings } from "../features/settings/Settings"
import { selectDarkTheme, setToggle } from "../features/settings/settingsSlice";
import { selectTracker } from "../features/timer/timerSlice";
import { Link } from "react-router-dom";

export const Header = () => {
  // * Settings selectors
  const darkTheme = useAppSelector(selectDarkTheme);
  // * Timer selectors
  const { isActive } = useAppSelector(selectTracker);
  // * Dispatch for all
  const dispatch = useAppDispatch();
  // @func to toggle modals for reports and settings 
  const toggleModal = (modalId: number) => {
    document.body.style.overflow = 'hidden';
    const newValue = {
      reports: modalId === 1 ? true : false,
      settings: modalId === 2 ? true : false
    }
    dispatch(setToggle(newValue));
  };
  return (
    <header className={`flex justify-between max-w-[620px] w-full py-2`}>
      {/* Main LOGO */}
      <Link to="/" className={`flex gap-1 justify-center items-center transition-opacity duration-250 ease ${isActive && darkTheme ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
        </svg>
        <h1 className="font-semibold min-[500px]:text-lg">Focus</h1>
      </Link>
      {/* Navbar */}
      <nav className={`flex justify-center items-center gap-4 transition-opacity duration-250 ease ${isActive && darkTheme ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
        {/* Navigation links */}
        <button title="Reports" type="button" className="flex items-center gap-1 bg-white/15 p-1 rounded min-[500px]:px-3 min-[500px]:py-2 lg:hover:bg-white/25" onClick={() => { toggleModal(1) }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 min-[500px]:size-5">
            <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm4.5 7.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0V12Zm2.25-3a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V9.75A.75.75 0 0 1 13.5 9Zm3.75-1.5a.75.75 0 0 0-1.5 0v9a.75.75 0 0 0 1.5 0v-9Z" clipRule="evenodd" />
          </svg>
          <span className="hidden text-xs min-[500px]:inline">Report</span>
        </button>
        <button title="Settings" type="button" className="flex items-center gap-1 bg-white/15 p-1 rounded min-[500px]:px-3 min-[500px]:py-2 lg:hover:bg-white/25" onClick={() => { toggleModal(2) }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 min-[500px]:size-5">
            <path fillRule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
          </svg>
          <span className="hidden text-xs min-[500px]:inline">Settings</span>
        </button>
        <Link to="/login" title="Sign In" className="flex items-center gap-1 bg-white/15 p-1 rounded min-[500px]:px-3 min-[500px]:py-2 lg:hover:bg-white/25">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 min-[500px]:size-5">
            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
          </svg>
          <span className="hidden text-xs min-[500px]:inline">Sign In</span>
        </Link>
        {/* Navigation links */}
      </nav>
      <Report />
      <Settings />
    </header>
  )
}
