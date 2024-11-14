import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import buttonSound from '../../assets/sounds/button/zapsplat_multimedia_button_click_001_68773.mp3';
import clock from '../../assets/sounds/session/clock-alarm-8761.mp3';
import dreamMemory from '../../assets/sounds/break/dream-memory-alarm-clock-109567.mp3';
import dreamscape from '../../assets/sounds/break/dreamscape-alarm-clock-117680.mp3';
import lofi from '../../assets/sounds/break/lofi-alarm-clock-243766.mp3';
import morningJoy from '../../assets/sounds/break/morning-joy-alarm-clock-20961.mp3';
import oversimplified from '../../assets/sounds/break/oversimplified-alarm-clock-113180.mp3';
import softPlucks from '../../assets/sounds/break/soft-plucks-alarm-clock-120696.mp3';
import starDust from '../../assets/sounds/break/star-dust-alarm-clock-114194.mp3';
import superMario from '../../assets/sounds/break/super-mario-64-alarm-clock-110801.mp3';
import tropical from '../../assets/sounds/break/tropical-alarm-clock-168821.mp3';
import vintage from '../../assets/sounds/break/vintage-alarm-clock-146234.mp3';
import { RootState } from "../../app/store";
/*
    * Music - defines the structure of the audio configuration for both alarms and breaks,
      - including the file path, label (for UI display), and volume (as a percentage).
    * AudioFiles - represents a single audio file with a label used for the UI and its file path.
*/
interface Music {
    alarm: {
        file: string,
        label: string,
        volume: number
    },
    break: {
        file: string | undefined,
        label: string,
        volume: number
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
        { value: dreamMemory, label: 'Dream' },
        { value: dreamscape, label: 'Escape' },
        { value: lofi, label: 'Lofi' },
        { value: morningJoy, label: 'Joy' },
        { value: oversimplified, label: 'Over' },
        { value: softPlucks, label: 'Plucks' },
        { value: starDust, label: 'Star' },
        { value: superMario, label: 'Mario' },
        { value: tropical, label: 'Tropical' },
        { value: vintage, label: 'Vintage' },
    ],
    alarmAudioFiles: [
        { value: clock, label: 'Clock' }
    ],
    music: {
        alarm: { file: clock, label: 'Clock', volume: 50 },
        break: { file: undefined, label: 'None', volume: 50 }
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
            buttonClickSound.volume = action.payload === 'SESSION_END' ? convertVolume(state.music.alarm.volume) : 1;
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
        }
    }
});

export const { playButtonSound, setMusic } = soundSlice.actions;
export const selectAlarmAudioFiles = (state: RootState) => state.sound.alarmAudioFiles;
export const selectBreakAudioFiles = (state: RootState) => state.sound.breakAudioFiles;
export const selectMusic = (state: RootState) => state.sound.music;

export default soundSlice.reducer;
