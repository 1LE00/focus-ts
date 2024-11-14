import { Minutes } from "../context/TimerContext";

interface ConfigSetting {
    key: string,
    value: number | Minutes | string[]
}
// * Configuration to store user's setting's preferences in indexedDB or in the backend
const configSettings: ConfigSetting[] = [
    { key: 'autoStartFocus', value: 0 },
    { key: 'autoStartBreak', value: 0 },
    { key: 'longBreakInterval', value: 4 },
    { key: 'darkModeEnabled', value: 0 },
    { key: 'minutes', value: { focus: 25, short: 5, long: 15 } },
    { key: 'focusSessionCompleted', value: 0 },
    { key: 'colorThemes', value: ['rgb(186, 74, 74)', 'rgb(64, 139, 196)', 'rgb(56, 138, 83)'] },
    { key: 'alarmSound', value: 0 },
    { key: 'alarmSoundVolume', value: 50 },
    { key: 'breakSound', value: 0 },
    { key: 'breakSoundVolume', value: 50 },
]

export default configSettings