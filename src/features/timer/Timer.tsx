import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setProgress, updateProgress } from "../../features/progressbar/progressbarSlice";
import { changeSessionCount, selectSessionCount } from "../../features/session/sessionSlice";
import { playButtonSound } from "../../features/sounds/soundSlice";
import { selectTheme } from "../../features/theme/themeSlice";
import { buttonConfigs, ChangesIn, Minutes, selectActiveButton, selectMinutes, selectTracker, setActiveButton, setChangesIn, setTracker } from "../../features/timer/timerSlice";
import { TimerButton } from "../../components/Buttons/TimerButton";
import { selectAutoStart, selectDarkTheme, selectToggle, selectNotificationOptions, selectLongBreakInterval } from "../settings/settingsSlice";

export const Timer = () => {
    // * Settings selectors
    const autoStart = useAppSelector(selectAutoStart);
    const darkTheme = useAppSelector(selectDarkTheme);
    const toggle = useAppSelector(selectToggle);
    const notificationOptions = useAppSelector(selectNotificationOptions);
    const longBreakInterval = useAppSelector(selectLongBreakInterval);
    // * Theme selectors
    const theme = useAppSelector(selectTheme);
    // * Timer selectors
    const activeButton = useAppSelector(selectActiveButton);
    const { isActive, isPaused, didTimerRun } = useAppSelector(selectTracker);
    const minutes = useAppSelector(selectMinutes);
    const { changesIn, totalDuration } = useAppSelector((state) => state.timer);
    // * Session selectors
    const sessionCount = useAppSelector(selectSessionCount);
    // * Dispatch for all
    const dispatch = useAppDispatch();

    // * Switch between focus and break sessions using sessionID to keep track of them
    const [session, changeSession] = useState({
        sessionID: 0
    });
    // * Actual Timer for the app
    const [countdown, setCountdown] = useState(minutes.focus * 60);
    // * Store setInterval function id to access them outside easily
    const [intervalId, setIntervalId] = useState<number | undefined>(undefined);
    // * Storing the initial values of minutes in ref to compare later
    const initialMinutesStateRef = useRef<Minutes>(minutes);
    // * React-router hook for changing location
    const navigate = useNavigate();

    // @func to switch between focus and break sessions
    const handleButtonClick = (buttonId: number) => {
        // * Set it to false so that focus or break session doesn't start after 
        // * they are automated
        dispatch(setTracker({ didTimerRun: false }));
        dispatch(setProgress());
        setCountdown(() => {
            return buttonId === 1 ? minutes.focus * 60 :
                buttonId === 2 ? minutes.short * 60 : minutes.long * 60
        });
        dispatch(setActiveButton(buttonId));
        if (isActive) {
            dispatch(setTracker({ isActive: false }));
            clearInterval(intervalId);
        }
        setIntervalId(undefined);
    };
    // @func to start the timer
    const startTimer = () => {
        if (!isActive) {
            dispatch(setTracker({ isActive: true }));
            const counterTime = totalDuration * 60 * 1000;
            const interval = 1000;
            const increment = (interval / counterTime) * 100;
            const id = setInterval(() => {
                setCountdown(prev => {
                    if (prev > 0) {
                        return prev - 1
                    } else {
                        clearInterval(id);
                        updateSession();
                        return 0;
                    }
                });
                dispatch(updateProgress(increment));
            }, interval);
            setIntervalId(id);
        }
    };
    // @func to pause the timer
    const pauseTimer = () => {
        dispatch(playButtonSound('BUTTON_CLICK'));
        clearInterval(intervalId);
        setIntervalId(undefined);
        dispatch(setTracker({ isActive: false, isPaused: true }));
    };
    // @func to start or resume the timer
    const resumeTimer = () => {
        dispatch(playButtonSound('BUTTON_CLICK'));
        dispatch(setTracker({ isPaused: false }));
        startTimer();
    };
    // @func to abstract the logic of switching states and avoid overlapping functionality   
    const toggleTimer = () => {
        /* 
            * Having this logic inside of if block prevented the functionality of spacebar and mouse click 
        */
        if (isActive) {
            pauseTimer();
        } else {
            resumeTimer();
        }
    };
    // @func to format time
    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    // @func to update the sessions after the timer reaches 00:00, display notifications and play sound
    const updateSession = (skipped?: boolean) => {
        let sessionID;
        if (activeButton === 1) {
            const interval = typeof longBreakInterval === 'number' ? longBreakInterval : Number(longBreakInterval);
            sessionID = (sessionCount.focus % interval === 0) ? 3 : 2;
        }
        else {
            sessionID = 1;
        }
        // * Don't show notifications when user skips sessions
        if (!skipped) {
            showNotifications(sessionID);
            dispatch(playButtonSound('SESSION_END'));
        }
        changeSession({ sessionID: sessionID });
    };
    // @func to skip sessions in between focus and break
    const skip = () => {
        clearInterval(intervalId);
        dispatch(setTracker({ isActive: false }));
        updateSession(true);
    };
    // @func to show notifications
    const showNotifications = (session: number) => {
        if (notificationOptions.enabled) {
            const title = session === 1 ? 'Time to Focus!' : session === 2 ? 'Time for a Short Break!' : 'Time for a Long Break!';
            const icon = session === 1 ? '/favicon.svg' : session === 2 ? '/favicon-short.svg' : '/favicon-long.svg';
            const notification = new Notification(title, { silent: notificationOptions.silent, icon: icon });
            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "visible") {
                    // * The tab has become visible so clear the now-stale Notification.
                    notification.close();
                }
            });
            notification.onclick = () => {
                window.focus();
                navigate('/');
            }
        }
    };

    // * Set changesIn as per the changes in the input field by comparing it with it's initial state
    // * Return true if they do not match, false otherwise
    useEffect(() => {
        // * Creating a new object to avoid repeatation of logic for each property
        // * and updating the state all at once rather than multiple calls within if statements 
        const newChanges: ChangesIn = {
            focus: initialMinutesStateRef.current.focus !== minutes.focus,
            short: initialMinutesStateRef.current.short !== minutes.short,
            long: initialMinutesStateRef.current.long !== minutes.long
        };
        dispatch(setChangesIn(newChanges));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minutes]);

    useEffect(() => {
        if (!toggle.settings) {
            // * Runs only when user changes their minutes preferences for focus or break 
            // * Creating a new object to map activeButton with corresponding property of minutes
            // * Adding a new property change so that logic is consolidated into a single if statement
            const buttonMap: { [key: number]: { change: boolean, value: number } } = {
                1: { change: changesIn.focus, value: minutes.focus * 60 },
                2: { change: changesIn.short, value: minutes.short * 60 },
                3: { change: changesIn.long, value: minutes.long * 60 }
            }
            if (buttonMap[activeButton].change) {
                // * set it back to defaults and only change it if user changes their preferences 
                dispatch(setChangesIn({
                    focus: false,
                    short: false,
                    long: false
                }));

                setCountdown(buttonMap[activeButton].value);
                // * Added dispactch for activeButton to solve syncroniztion with totalDuration when user changes minutes for session
                dispatch(setActiveButton(activeButton));
                dispatch(setProgress());
                clearInterval(intervalId);
                setIntervalId(undefined);
                dispatch(setTracker({ isActive: false }));
            }
            // * Change the initial state after the user has changed their preferences 
            initialMinutesStateRef.current = minutes;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toggle.settings]);
    // * Auto start focus and break sessions if it is turned on
    useEffect(() => {
        // * Auto start break session after the focus session ends
        if (activeButton !== 1 && autoStart.break && didTimerRun) {
            dispatch(setTracker({ didTimerRun: false }));
            setTimeout(() => {
                startTimer();
            }, 1000);

        }
        // * Auto start focus session after the break session ends
        if (activeButton === 1 && autoStart.focus && didTimerRun) {
            dispatch(setTracker({ didTimerRun: false }));
            setTimeout(() => {
                startTimer();
            }, 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeButton, didTimerRun])
    /* 
        * Switch to focus or break session depending upon the sessionID
        * Keeps track of completed focus sessions and stores them in local storage
    */
    useEffect(() => {
        if (session.sessionID) {
            handleButtonClick(session.sessionID);
            dispatch(setTracker({ didTimerRun: true }));
        }
        if (session.sessionID === 2 || session.sessionID === 3) {
            dispatch(changeSessionCount({
                focus: sessionCount.focus + 1,
                break: sessionCount.focus
            }))
            localStorage.setItem("Sessions Completed", sessionCount.focus.toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);
    // * Cleanup interval on unmount
    useEffect(() => {
        return () => clearInterval(intervalId);
    }, [intervalId]);
    // * Space bar functionality
    useEffect(() => {
        const spacebarFunction = (event: KeyboardEvent): void => {
            if ((event.key === ' ' || event.code === 'space') && !event.repeat) {
                // * To stop from switching between sessions and the default behaviour  
                event.preventDefault();
                /*     
                    * Seperated the logic that is now inside of 
                      @func toogleTimer() 
                    * To abstract the logic of switching states and avoid overlapping functionality
                    * Now you can resume/pause using spacebar and mouse click alternately 
                */
                toggleTimer();
            }
        };
        window.addEventListener('keydown', spacebarFunction as unknown as EventListener);
        return () => {
            window.removeEventListener('keydown', spacebarFunction as unknown as EventListener);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]);
    //  * Change the title of the document
    useEffect(() => {
        const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        let message = '';
        // * Change the icon into pause only when intervalId is undefined and timer is NOT ACTIVE
        if (activeButton === 1) {
            favicon.href = isPaused ? '/favicon-pause.svg' : '/favicon.svg';
            message = 'Time to Focus!';
        } else if (activeButton === 2) {
            favicon.href = isPaused ? '/favicon-pause.svg' : '/favicon-short.svg';
            message = 'Time for a Break!';
        } else {
            favicon.href = isPaused ? '/favicon-pause.svg' : '/favicon-long.svg';
            message = 'Time for a Break!'
        }
        document.title = `${formatTime(countdown)} - ${message}`;
    }, [countdown, activeButton, isPaused]);
    // * Ensure that timer component stats with focus session and progress are set to zero 
    // * After navigation from other pages like '/login'
    // * Set isActive to false if user starts a timer and navigates to other pages
    useEffect(() => {
        dispatch(setActiveButton(1));
        dispatch(setProgress());
        dispatch(setTracker({ isActive: false }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <main className={`flex flex-col justify-center items-center mt-10 mb-8 w-full transition-colors duration-250 linear ${isActive && darkTheme ? 'bg-transparent' : 'bg-white/10'} p-4 rounded-lg max-w-[480px] min-[500px]:mt-12 min-[500px]:p-6`}>
            <header className={`timer-header flex justify-center items-center gap-4 transition-opacity duration-250 linear ${isActive && darkTheme ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
                {buttonConfigs.map((config => (
                    <TimerButton
                        key={config.id}
                        activeButton={activeButton}
                        theme={theme}
                        handleButtonClick={() => handleButtonClick(config.id)}
                        title={config.title}
                        buttonId={config.id} />
                )))}
            </header>
            <section className="timer text-7xl my-8 pointer-events-none min-[500px]:text-9xl min-[500px]:font-medium">{formatTime(countdown)}</section>
            <footer className="flex justify-center items-center w-full relative max-w-xs mb-4">
                <button type="button" title='Press Spacebar to start/pause' id='start' className={`${activeButton === 1 ? `text-${theme.focus}` : activeButton === 2 ? `text-${theme.short}` : `text-${theme.long}`} px-12 py-4 font-semibold uppercase rounded ${isActive && darkTheme ? `bg-transparent text-white` : 'bg-white'} w-full max-w-[65%] min-[500px]:text-xl ${isActive ? ' translate-y-1 shadow-none' : 'shadow-start'}`} onClick={isActive ? pauseTimer : resumeTimer} >
                    {isActive ? 'Pause' : 'Start'}</button>
                <button type="button" title={`Skip ${activeButton === 1 ? 'Focus' : 'Break'} Session`} className={`ml-8 absolute right-2 top-5 ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} duration-200 ease-in`}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="15" viewBox="0 0 320 512"><path fill="#fff" d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416L0 96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241l0-145c0-17.7 14.3-32 32-32s32 14.3 32 32l0 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-145-11.5 9.6-192 160z" onClick={() => skip()} /></svg>
                </button>
            </footer>
        </main>
    )
}
