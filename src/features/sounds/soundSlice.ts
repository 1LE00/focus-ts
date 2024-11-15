import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import buttonSound from '../../assets/sounds/button/zapsplat_multimedia_button_click_001_68773.mp3';
import Clock from '../../assets/sounds/session/clock-alarm-8761.mp3';
import Dream from '../../assets/sounds/break/dream-memory-alarm-clock-109567.mp3';
import Escape from '../../assets/sounds/break/dreamscape-alarm-clock-117680.mp3';
import Lofi from '../../assets/sounds/break/lofi-alarm-clock-243766.mp3';
import Joy from '../../assets/sounds/break/morning-joy-alarm-clock-20961.mp3';
import Over from '../../assets/sounds/break/oversimplified-alarm-clock-113180.mp3';
import Plucks from '../../assets/sounds/break/soft-plucks-alarm-clock-120696.mp3';
import Star from '../../assets/sounds/break/star-dust-alarm-clock-114194.mp3';
import Mario from '../../assets/sounds/break/super-mario-64-alarm-clock-110801.mp3';
import Tropical from '../../assets/sounds/break/tropical-alarm-clock-168821.mp3';
import vintage from '../../assets/sounds/break/vintage-alarm-clock-146234.mp3';
import { RootState } from "../../app/store";
import { MusicType } from "../../config/config";
/*
    * Music - defines the structure of the audio configuration for both alarms and breaks,
      - including the file path, label (for UI display), and volume (as a percentage).
    * AudioFiles - represents a single audio file with a label used for the UI and its file path.
*/
interface Music {
    alarm: {
        file: string,
        label: string,
        volume?: number
    },
    break: {
        file: string,
        label: string,
        volume?: number
    }
}

export interface AudioFiles {
    value: string,
    label: string
}

interface SoundsState {
    breakAudioFiles: AudioFiles[],
    alarmAudioFiles: AudioFiles[],
    music: Music,
}

const initialState: SoundsState = {
    breakAudioFiles: [
        { value: Dream, label: 'Dream' },
        { value: Escape, label: 'Escape' },
        { value: Lofi, label: 'Lofi' },
        { value: Joy, label: 'Joy' },
        { value: Over, label: 'Over' },
        { value: Plucks, label: 'Plucks' },
        { value: Star, label: 'Star' },
        { value: Mario, label: 'Mario' },
        { value: Tropical, label: 'Tropical' },
        { value: vintage, label: 'Vintage' },
    ],
    alarmAudioFiles: [
        { value: Clock, label: 'Clock' }
    ],
    music: {
        alarm: { file: Clock, label: 'Clock', volume: 50 },
        break: { file: '', label: 'None', volume: 50 }
    }
}
// * Converts volume percentage (0-100) to a 0-1 scale suitable for the Audio API.
export const convertVolume = (volume: number): number => (volume > 0 ? volume / 100 : volume);
/*  
    * playButtonSound - Plays a button sound based on the provided action type when a session ends and on timer start and pause.
    * The action payload can be 'BUTTON_CLICK' or 'SESSION_END'.
    * 'BUTTON_CLICK': Plays the general button click sound.
    * 'SESSION_END': Plays the alarm sound with adjusted volume for the session end.
*/
const soundSlice = createSlice({
    name: 'sound',
    initialState,
    reducers: {
        playButtonSound: (state, action: PayloadAction<string>) => {
            const soundToPlay = action.payload === 'BUTTON_CLICK' ? buttonSound : state.music.alarm.file;
            const buttonClickSound = new Audio(soundToPlay);
            buttonClickSound.volume = action.payload === 'SESSION_END' ? convertVolume(state.music.alarm.volume as number) : 1;
            // * Automatically stop the sound after 3 seconds for session end
            if (action.payload === 'SESSION_END') {
                setTimeout(() => {
                    buttonClickSound.pause();
                    buttonClickSound.currentTime = 0;
                }, 3000);
            }
            try {
                buttonClickSound.play();
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        },
        setMusic: (state, action: PayloadAction<Partial<Music>>) => {
            state.music = { ...state.music, ...action.payload }
        },
        setAlarmSound: (state, action: PayloadAction<MusicType>) => {
            state.music.alarm = { ...state.music.alarm, ...action.payload };
        },
        setAlarmVolume: (state, action: PayloadAction<number>) => {
            state.music.alarm.volume = action.payload;
        },
        setBreakSound: (state, action: PayloadAction<MusicType>) => {
            state.music.break = { ...state.music.break, ...action.payload };
        },
        setBreakVolume: (state, action: PayloadAction<number>) => {
            state.music.break.volume = action.payload;
        },
    }
});

export const { playButtonSound, setMusic, setAlarmSound, setBreakSound, setAlarmVolume, setBreakVolume } = soundSlice.actions;
export const selectAlarmAudioFiles = (state: RootState) => state.sound.alarmAudioFiles;
export const selectBreakAudioFiles = (state: RootState) => state.sound.breakAudioFiles;
export const selectMusic = (state: RootState) => state.sound.music;

export default soundSlice.reducer;
