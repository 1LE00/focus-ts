import { Theme } from "../features/theme/themeSlice"
import { Minutes } from "../features/timer/timerSlice"
import Clock from '../assets/sounds/session/clock-alarm-8761.mp3';

export type MusicType = {
    file: string,
    label: string,
}

export interface ConfigSetting {
    key: string,
    value: Partial<Theme> | MusicType | number | Minutes
}
// * Configuration to store user's setting's preferences in indexedDB
const configSettings: ConfigSetting[] = [
    { key: 'autoStartFocus', value: 0 },
    { key: 'autoStartBreak', value: 0 },
    { key: 'longBreakInterval', value: 4 },
    { key: 'darkModeEnabled', value: 0 },
    { key: 'minutes', value: { focus: 25, short: 5, long: 15 } },
    { key: 'focusSessionCompleted', value: 1 },
    { key: 'colorThemes', value: { focus: 'focus', short: 'short', long: 'long' } },
    { key: 'alarmSound', value: { label: 'Clock', file: Clock } },
    { key: 'alarmSoundVolume', value: 50 },
    { key: 'breakSound', value: { label: 'None', file: '' } },
    { key: 'breakSoundVolume', value: 50 },
]

export type TagsAndProjects = {
    name: string,
    color: string
}

export type Tags = {
    key: 'tags',
    value: TagsAndProjects[]
}

export type Projects = {
    key: 'projects',
    value: TagsAndProjects[]
}

export const userTags: Tags = { key: 'tags', value: [] };
export const userProjects: Projects = { key: 'projects', value: [] };

export default configSettings