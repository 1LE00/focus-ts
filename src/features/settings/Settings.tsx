import { ThemeButton } from "../../components/Buttons/ThemeButton";
import { Dropdown } from "../../components/Dropdowns/Dropdown";
import { ChangeEvent, FocusEvent, KeyboardEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectColors, selectTheme, updateTheme } from "../../features/theme/themeSlice";
import { selectMinutes, setMinutes, setTracker } from "../../features/timer/timerSlice";
import { selectAlarmAudioFiles, selectBreakAudioFiles, selectMusic } from "../../features/sounds/soundSlice";
import { selectAutoStart, selectDarkTheme, selectLongBreakInterval, selectNotificationOptions, selectToggle, setAutoStart, setDarkTheme, setLongBreakInterval, setNotificationOptions, setToggle } from "./settingsSlice";
import { selectDatabase } from "../database/DatabaseSlice";
import { updateConfigSettingsinDB } from "../database/Thunks";
import { selectSessionCount } from "../session/sessionSlice";

export const Settings = () => {
    // * Settings selectors
    const autoStart = useAppSelector(selectAutoStart);
    const darkTheme = useAppSelector(selectDarkTheme);
    const toggle = useAppSelector(selectToggle);
    const notificationOptions = useAppSelector(selectNotificationOptions);
    const longBreakInterval = useAppSelector(selectLongBreakInterval);
    // * Timer selectors
    const minutes = useAppSelector(selectMinutes);
    // * Theme selectors
    const theme = useAppSelector(selectTheme);
    const colors = useAppSelector(selectColors);
    // * Sound selectors
    const alarmAudioFiles = useAppSelector(selectAlarmAudioFiles);
    const breakAudioFiles = useAppSelector(selectBreakAudioFiles);
    const music = useAppSelector(selectMusic);
    // * Session selectors
    const sessionCount = useAppSelector(selectSessionCount);
    // * Dispatch for all
    const dispatch = useAppDispatch();
    // * Database related constants
    const db = useAppSelector(selectDatabase) as IDBDatabase;

    // * Actions to be performed when we close the settings modal
    const closeModal = () => {
        document.body.style.overflow = 'initial';
        // * Set all the toggles in nav to false
        dispatch(setToggle({
            reports: false,
            settings: false
        }));
        // * Set it to false so any session doesn't start after the timer has run
        // * and user decides to automate focus or break
        dispatch(setTracker({ didTimerRun: false }));
        // * Update the database after the user closes the settings modal 
        updateConfigSettingsinDB(db, 'minutes', minutes);
        updateConfigSettingsinDB(db, 'longBreakInterval', Number(longBreakInterval));
        updateConfigSettingsinDB(db, 'focusSessionCompleted', sessionCount.focus);
        updateConfigSettingsinDB(db, 'darkModeEnabled', Number(darkTheme));
        updateConfigSettingsinDB(db, 'colorThemes', {
            focus: theme.focus,
            short: theme.short,
            long: theme.long
        });
        updateConfigSettingsinDB(db, 'alarmSound', { label: music.alarm.label, file: music.alarm.file });
        updateConfigSettingsinDB(db, 'alarmSoundVolume', Number(music.alarm.volume));
        updateConfigSettingsinDB(db, 'breakSound', { label: music.break.label, file: music.break.file });
        updateConfigSettingsinDB(db, 'breakSoundVolume', Number(music.break.volume));
        updateConfigSettingsinDB(db, 'autoStartFocus', Number(autoStart.focus));
        updateConfigSettingsinDB(db, 'autoStartBreak', Number(autoStart.break));
    };
    // * Actions to be performed when user sets preferences for focus and break sessions
    const handleChangeInMinutes = (id: number, event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const key = id === 1 ? 'focus' : id === 2 ? 'short' : 'long';
        // * Return an empty string if we get an empty value
        if (value === '') {
            return dispatch(setMinutes({ [key]: '' }));
        }
        // * Return the parsed value, if the value > 999, return 999
        const parsedValue = Math.min(999, Number.parseInt(value));
        dispatch(setMinutes({ [key]: parsedValue }));
    };
    // @func to remove leading zeroes on focus and break inputs on BLUR and 
    // * change it to default values if user inputs 0 or nothing
    const removeLeadingZeroes = (id: number, event: FocusEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const startsWithZero = value.startsWith('0') && value.length > 1;
        if (startsWithZero || value === '' || value === '0') {
            const key = id === 1 ? 'focus' : id === 2 ? 'short' : 'long';
            const newValue = minutes[key].toString().replace(/^0+/, '');
            // * Set fallback value only if the newValue is empty
            let finalValue;
            if (newValue === '') {
                finalValue = id === 1 ? 25 : id === 2 ? 5 : 15;
            } else {
                finalValue = Number(newValue);
            }
            dispatch(setMinutes({ [key]: finalValue }));
        }
    };
    // @func to prevent user from entering characters like +, - in focus and break input boxes 
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === '+' || e.key === '-' || e.key === '=') {
            e.preventDefault();
        }
    };
    // * Set the value for Long Break Interval
    const handleLongBreak = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        return value === '' ? dispatch(setLongBreakInterval('')) : dispatch(setLongBreakInterval(Math.min(30, Number.parseInt(value))));
    };
    // @func to handel notifications changes like enabled, silent
    const handleNotificationsChange = (event: ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        // * Check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support notifications.");
            return;
        }
        // * Ask for permission to display notifications or check enabled if already asked
        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    dispatch(setNotificationOptions({ enabled: isChecked }));
                } else {
                    alert('Permission denied for notifications.\nPlease click "View Site Information" icon or "Bell Icon" in the url to allow notifications.');
                }
            }).catch(error => {
                console.error('Error requesting notification permission:', error);
            });
        } else {
            dispatch(setNotificationOptions({ enabled: isChecked }));
        }
        if (!isChecked) {
            dispatch(setNotificationOptions({ silent: isChecked }));
        }
    };
    // * store the contents of theme content like their title, visibility and theme number
    const [themeContent, setThemeContent] = useState({
        title: '',
        show: false,
        themeNumber: 1
    });
    // @func to open theme modal
    const openThemeModal = (themeNumber: number) => {
        const themeContentTitle = themeNumber === 1 ? 'Focus' : themeNumber === 2 ? 'Short Break' : 'Long Break';
        setThemeContent({
            title: themeContentTitle,
            themeNumber: themeNumber,
            show: true
        })
    };
    // @func to pick a theme for a particular session
    const pickATheme = (themeName: string) => {
        const themeKey = themeContent.themeNumber === 1 ? 'focus' : themeContent.themeNumber === 2 ? 'short' : 'long';
        dispatch(updateTheme({ [themeKey]: themeName }));
        setThemeContent(previous => ({
            ...previous,
            show: false
        }));
    };

    return (
        <>
            <section className={`${toggle.settings ? 'flex' : 'hidden'} ${themeContent.show ? 'opacity-0' : 'opacity-1'} justify-center fixed inset-0 bg-black/75 z-10`} onClick={closeModal}>
                <section className={`${toggle.settings ? 'flex' : 'hidden'} flex-col relative top-11 rounded-md m-3 pt-4 w-modal-custom h-modal-custom max-w-xs bg-slate-50`} onClick={(event) => event.stopPropagation()}>
                    <header className="text-gray-500 flex justify-between items-center w-modal-custom ml-4 pb-2 border-b border-black/20">
                        <h2 className="uppercase font-medium text-sm flex-grow text-center">Settings</h2>
                        <button type="button" aria-label="close settings modal" onClick={closeModal}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </header>
                    <section className="modal-body overflow-auto px-4">
                        {/* Timer options */}
                        <section className="timer-options text-gray-500 my-4">
                            <section className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <h2 className="uppercase font-medium text-sm">Timer</h2>
                            </section>
                            {/* Timer values */}
                            <section className="timer-values mt-6">
                                <header className="flex items-center gap-1 relative">
                                    <p className="text-sm font-semibold text-black/75">Time(Minutes)</p>
                                    <section className="group">
                                        <svg className='cursor-pointer size-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-xs absolute invisible -top-14 left-0 w-full bg-gray-500 text-white p-2 rounded group-hover:visible">Changing the fields below while timer is running will reset the respective timer</p>
                                    </section>
                                </header>
                                <section className="flex justify-between items-center mt-2">
                                    <section className="flex flex-col items-center justify-center gap-2">
                                        <label htmlFor="focus" className="text-sm">Focus</label>
                                        <input type="number" name="focus" id="focus" className="bg-gray-500/10 rounded text-center text-black/50 text-sm p-2 border-t-0 border-l-0 border-b-2 border-solid border-b-black/10 border-r-2 border-r-black/10 shadow-number" min={1} max={999} value={minutes?.focus} onChange={(e) => handleChangeInMinutes(1, e)} onKeyDown={handleKeyDown} onBlur={(e) => removeLeadingZeroes(1, e)} />
                                    </section>
                                    <section className="flex flex-col items-center justify-center gap-2">
                                        <label htmlFor="short-break" className="text-sm">Short Break</label>
                                        <input type="number" name="short-break" id="short-break" className="bg-gray-500/10 rounded text-center text-sm text-black/50 p-2 border-t-0 border-l-0 border-b-2 border-solid border-b-black/10 border-r-2 border-r-black/10 shadow-number" min={1} max={999} value={minutes?.short} onChange={(e) => handleChangeInMinutes(2, e)} onKeyDown={handleKeyDown} onBlur={(e) => removeLeadingZeroes(2, e)} />
                                    </section>
                                    <section className="flex flex-col items-center justify-center gap-2">
                                        <label htmlFor="long-break" className="text-sm">Long Break</label>
                                        <input type="number" name="long-break" id="long-break" className="bg-gray-500/10 rounded text-center text-sm text-black/50 p-2 border-t-0 border-l-0 border-b-2 border-solid border-b-black/10 border-r-2 border-r-black/10 shadow-number" min={1} max={999} value={minutes?.long} onChange={(e) => handleChangeInMinutes(3, e)} onKeyDown={handleKeyDown} onBlur={(e) => removeLeadingZeroes(3, e)} />
                                    </section>
                                </section>
                            </section>
                            {/* Auto Start Break */}
                            <section className="flex items-center justify-between my-4">
                                <label htmlFor="auto-break" className="text-black/75 text-sm font-medium">Auto Start Breaks</label>
                                <input type="checkbox" name="auto-break" id="auto-break" className="w-14 h-8 rounded-3xl bg-gray-500/10 relative checked:bg-green-400 shadow-checkbox transition-colors ease-linear duration-500 cursor-pointer" aria-label="Set auto-focus to true" checked={autoStart.break} onChange={(e) =>
                                    dispatch(setAutoStart({
                                        break: e.target.checked
                                    }))} />
                            </section>
                            {/* Auto Start Focus */}
                            <section className="flex items-center justify-between mb-4">
                                <label htmlFor="auto-focus" className="text-black/75 text-sm font-medium">Auto Start Focus</label>
                                <input type="checkbox" name="auto-focus" id="auto-focus" className="w-14 h-8 rounded-3xl bg-gray-500/10 relative checked:bg-green-400 shadow-checkbox transition-colors ease-linear duration-500 cursor-pointer" aria-label="Set auto-break to true" checked={autoStart.focus} onChange={(e) =>
                                    dispatch(setAutoStart({
                                        focus: e.target.checked
                                    }))} />
                            </section>
                            {/* Long Break Intervals */}
                            <section className="flex items-center justify-between pb-8 pt-2 border-b border-black/20">
                                <label htmlFor="long-break-interval" className="text-black/75 text-sm font-medium">Long Break Intervals</label>
                                <input type="number" name="long-break-interval" id="long-break-interval" className="bg-gray-500/10 rounded text-center text-black/50 p-2 w-20 text-sm border-t-0 border-l-0 border-b-2 border-solid border-b-black/10 border-r-2 border-r-black/10 shadow-number" min={1} max={999} value={longBreakInterval} onChange={(e) => handleLongBreak(e)} onKeyDown={handleKeyDown} onBlur={() =>
                                    dispatch(setLongBreakInterval(longBreakInterval.toString().replace(/^0+/, '') || 4))} />
                            </section>
                        </section>
                        {/* Timer options */}

                        {/* Theme options */}
                        <section className="text-gray-500 my-4 border-b border-b-black/20">
                            <section className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
                                </svg>
                                <h2 className="uppercase font-medium text-sm">Theme</h2>
                            </section>
                            <section className="theme-options mt-4">
                                <section className="flex items-center justify-between my-4">
                                    <p className="text-black/75 text-sm font-medium">Color Themes</p>
                                    <section className="flex items-center justify-between w-32">
                                        <button type="button" className={`bg-${theme.focus} w-8 h-8 rounded-md`} title="focus session background-color picker" onClick={() => openThemeModal(1)}></button>
                                        <button type="button" className={`bg-${theme.short} w-8 h-8 rounded-md`} title="short break session background-color picker" onClick={() => openThemeModal(2)}></button>
                                        <button type="button" className={`bg-${theme.long} w-8 h-8 rounded-md`} title="long break session background-color picker" onClick={() => openThemeModal(3)}></button>
                                    </section>
                                </section>
                                {/* Dark Mode */}
                                <section className="flex items-center justify-between my-4">
                                    <label htmlFor="dark-mode" className="text-black/75 text-sm font-medium">Dark Mode while running</label>
                                    <input type="checkbox" name="dark-mode" id="dark-mode" className="w-14 h-8 rounded-3xl bg-gray-500/10 relative checked:bg-green-400 shadow-checkbox transition-colors ease-linear duration-500 cursor-pointer" aria-label="Set dark mode to true" checked={darkTheme} onChange={(e) => dispatch(setDarkTheme(e.target.checked))} />
                                </section>
                            </section>
                        </section>
                        {/* Theme options */}

                        {/* Sound options */}
                        <section className="text-gray-500 my-4 border-b border-b-black/20">
                            <section className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                                </svg>
                                <h2 className="uppercase font-medium text-sm">Sound</h2>
                            </section>
                            <section className="sound-options mt-4">
                                <section className="flex items-baseline justify-between my-4">
                                    <p className="text-black/75 text-sm font-medium">Alarm Sound</p>
                                    <Dropdown audioArray={alarmAudioFiles} isBreakAudio={false} />
                                </section>
                                <section className="flex items-baseline justify-between my-4">
                                    <p className="text-black/75 text-sm font-medium">Break Sound</p>
                                    <Dropdown audioArray={breakAudioFiles} isBreakAudio={true} />
                                </section>
                            </section>
                        </section>
                        {/* Sound options */}

                        {/* Notfications options */}
                        <section className="text-gray-500 my-4 border-b border-b-black/20">
                            <section className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                                </svg>
                                <h2 className="uppercase font-medium text-sm">Notifications</h2>
                            </section>
                            <section className="notifications-options mt-4">
                                <section className="flex items-center justify-between my-4">
                                    <label htmlFor="enable-notifications" className="text-black/75 text-sm font-medium">Enable Notifications</label>
                                    <input type="checkbox" name="enable-notifications" id="enable-notifications" className="w-14 h-8 rounded-3xl bg-gray-500/10 relative checked:bg-green-400 shadow-checkbox transition-colors ease-linear duration-500 cursor-pointer" aria-label="Enable notifications" checked={notificationOptions.enabled} onChange={(e) => handleNotificationsChange(e)} />
                                </section>
                                <section className="flex items-center justify-between my-4">
                                    <label htmlFor="silent-notifications" className="text-black/75 text-sm font-medium">Silent Notifications</label>
                                    <input type="checkbox" name="silent-notifications" id="silent-notifications" className="w-14 h-8 rounded-3xl bg-gray-500/10 relative checked:bg-green-400 shadow-checkbox transition-colors ease-linear duration-500 cursor-pointer" aria-label="Set silent-notifications to true" checked={notificationOptions.silent} onChange={(e) =>
                                        dispatch(setNotificationOptions({
                                            silent: notificationOptions.enabled ? e.target.checked : false
                                        }))} />
                                </section>
                            </section>
                        </section>
                        {/* Notfications options */}

                        {/* Task options */}
                        <section className="text-gray-500 my-4">
                            <section className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>

                                <h2 className="uppercase font-medium text-sm">Tasks</h2>
                            </section>
                            <section className="task-options mt-4">
                                <section className="flex items-center justify-between my-4">
                                    <p className="text-black/75 text-sm font-medium">Add tasks</p>
                                </section>
                            </section>
                        </section>
                        {/* Tasks options */}
                    </section>
                </section>
            </section >
            {/* Theme Modal */}
            <section className={`theme-modal ${themeContent.show ? 'flex' : 'hidden'} justify-center items-center fixed inset-0 bg-black/75 z-10 px-4`
            } onClick={() => setThemeContent(previous => ({ ...previous, show: false }))}>
                <section className={`theme-modal-content bg-white relative px-8 py-4 rounded-lg max-w-96`} onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-gray-900/90 font-medium mb-4 pb-4 border-b-2 border-b-gray-700/20 text-base text-center">Pick a color for {themeContent.title}</h2>
                    <section className="color-picker flex w-full items-start flex-wrap gap-4 overflow-auto">
                        {themeContent.show && colors.map(({ colorName, value }) =>
                            <ThemeButton
                                key={colorName}
                                color={value}
                                pickATheme={() => pickATheme(colorName)}
                                title={colorName}
                                renderSVG={themeContent.themeNumber === 1 ? theme.focus === colorName : themeContent.themeNumber === 2 ? theme.short === colorName : theme.long === colorName}
                            />
                        )}
                    </section>
                </section>
            </section >
        </>
    )
}
