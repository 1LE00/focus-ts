import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AudioFiles, convertVolume, selectMusic, setMusic } from "../../features/sounds/soundSlice";
import { selectActiveButton, selectTracker } from "../../features/timer/timerSlice";

type DropdownProps = {
    audioArray: AudioFiles[],
    isBreakAudio: boolean
}

export const Dropdown = ({ audioArray, isBreakAudio }: DropdownProps) => {
    // * Sound selectors
    const music = useAppSelector(selectMusic);
    // * Timer selectors
    const activeButton = useAppSelector(selectActiveButton);
    const { isActive } = useAppSelector(selectTracker);
    // * Dispatch for all
    const dispatch = useAppDispatch();
    // * Local states and refs
    const [toggleDropDown, setToggleDropDown] = useState(false);
    const breakMusicRef = useRef(new Audio());
    const dropDownRef = useRef<HTMLElement | null>(null);
    // * Capture the current music
    const currentMusic = isBreakAudio ? music.break : music.alarm;

    // @func -toogle dropdown and select the correct music for alarm and break 
    const handleSelect = (label: string, value: string | undefined) => {
        setToggleDropDown(!toggleDropDown);
        dispatch(setMusic({
            [isBreakAudio ? 'break' : 'alarm']:
            {
                file: value,
                label: label,
                volume: music[isBreakAudio ? 'break' : 'alarm'].volume
            }
        }));
    };
    // * Make the dropdown be visible as whole when clicked on
    useEffect(() => {
        if (toggleDropDown) {
            if (dropDownRef.current !== null) {
                dropDownRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [toggleDropDown]);
    // @func handle volume change based on user input for alarm and break sound
    const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const volume = event.target.value;
        dispatch(setMusic({
            [isBreakAudio ? 'break' : 'alarm']:
            {
                ...music[isBreakAudio ? 'break' : 'alarm'],
                volume: volume
            }
        }))
    };

    // @func to close the dropdown if user clicks outside of the dropdown or selected option
    const handleClickOutside = (event: MouseEvent) => {
        if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
            setToggleDropDown(false);
        }
    };
    // * Add a eventlistener to handle click outside of the dropdown and selected option
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);
    // * Set the audio src based on music.break.file
    // * Seperating this from the other effect so that the music doesn't
    // * restart from 0 after pausing
    useEffect(() => {
        const breakMusic = breakMusicRef.current;
        if (music.break.file) {
            breakMusic.src = music.break.file;
            breakMusic.loop = true;
        }
        // * Pause the timer when user selects 'None' as break sound after playing a music
        return () => {
            breakMusic.pause();
        }
    }, [music.break.file]);
    /* 
        * Handle volume change while the music is playing
        * Play music only when the timer is active and break session is on
        * Only play music if the user selects valid music 
    */
    useEffect(() => {
        const breakMusic = breakMusicRef.current;
        breakMusic.volume = convertVolume(music.break.volume);
        const handlePlayback = async () => {
            try {
                if (isActive && activeButton !== 1) {
                    await breakMusic.play();
                } else {
                    breakMusic.pause();
                }
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        };
        // * Don't play the audio if user selects None as break sound
        if (music.break.file) {
            handlePlayback();
        }
        // * 
    }, [activeButton, isActive, music.break.file, music.break.volume]);
    /* 
        * Set the playback duration back to 0 when you change session,
        * It will allow the music to start from the beginning rather than 
        * From the last time it was paused after the break session ended
    */
    useEffect(() => {
        const breakMusic = breakMusicRef.current;
        breakMusic.currentTime = 0;
    }, [activeButton])

    return (
        <section className="flex flex-col items-end gap-4">
            <section className="relative cursor-pointer" ref={dropDownRef}>
                <section className="selected relative text-sm bg-gray-500/10 py-2 px-3 rounded shadow-number min-w-28" onClick={() => setToggleDropDown(prev => !prev)}>
                    {currentMusic.label}
                    <span className="arrow absolute top-[50%] right-3 border-l-[7px] border-r-[7px] border-t-[7px] border-transparent border-t-black/50 translate-y-[-50%]"></span>
                </section>
                {toggleDropDown &&
                    <ul className={`audio-list text-sm bg-white w-full rounded shadow-dropdown absolute mt-1 z-10 ${isBreakAudio && 'h-64 overflow-auto'}`}>
                        {isBreakAudio && <li className="text-sm hover:bg-gray-500/10 py-3 px-4 border-b" onClick={() => handleSelect("None", undefined)}>None</li>}
                        {audioArray.map(({ value, label }) => {
                            return <li key={label} className="text-sm hover:bg-gray-500/10 py-3 px-4 border-b" onClick={() => handleSelect(label, value)}>{label}</li>
                        })}
                    </ul>
                }
            </section>
            <section className="flex items-center gap-4">
                <label htmlFor={`${currentMusic.label.toLowerCase()}-volume`} className="text-sm">{currentMusic.volume}</label>
                <input type="range" name={`${currentMusic.label.toLowerCase()}-volume`} id={`${currentMusic.label.toLowerCase()}-volume`} min={0} max={100} value={currentMusic.volume} onChange={(e) => handleVolumeChange(e)} className="custom-range" />
            </section>
        </section>
    )
}