import { createAsyncThunk } from "@reduxjs/toolkit";
import configSettings, { ConfigSetting, MusicType, Projects, Tags, TagsAndProjects, userProjects, userTags } from "../../config/config";
import { setAutoStartBreak, setAutoStartFocus, setDarkTheme, setLongBreakInterval } from "../settings/settingsSlice";
import { Minutes, setMinutesFromConfig } from "../timer/timerSlice";
import { changeSessionCount } from "../session/sessionSlice";
import { Theme, updateTheme } from "../theme/themeSlice";
import { setAlarmSound, setAlarmVolume, setBreakSound, setBreakVolume } from "../sounds/soundSlice";
import { addTagName } from "../tags/tagSlice";
import { addProjectName } from "../projects/projectSlice";

export const initializeDatabase = createAsyncThunk('database/initialize', async (_, { rejectWithValue }) => {
    const openDatabase = (name: string, version: number) => {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request: IDBOpenDBRequest = indexedDB.open(name, version);

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBRequest).result as IDBDatabase;
                if (!db.objectStoreNames.contains('config')) {
                    const objectStore = db.createObjectStore('config', { keyPath: 'key' });
                    objectStore.transaction.oncomplete = () => {
                        const configObjectStore = db.transaction('config', 'readwrite').objectStore('config');
                        configSettings.forEach(setting => {
                            configObjectStore.add(setting);
                        })
                    }
                }

                if (!db.objectStoreNames.contains('activity')) {
                    const objectStore = db.createObjectStore('activity', { keyPath: 'key' });
                    objectStore.transaction.oncomplete = () => {
                        const activityObjectStore = db.transaction('activity', 'readwrite').objectStore('activity');
                        activityObjectStore.add(userTags);
                        activityObjectStore.add(userProjects);
                    }
                }
            }

            request.onsuccess = (event: Event) => {
                resolve((event.target as IDBRequest).result as IDBDatabase);
            }

            request.onerror = (event: Event) => {
                reject(((event.target as IDBRequest).error));
            }
        });
    }
    try {
        return openDatabase('Focus', 1);
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const fetchAndSyncConfigData = createAsyncThunk('database/fetchAndSyncConfigData', async (_, { dispatch, rejectWithValue }) => {
    const getConfigData = async () => {
        return new Promise<ConfigSetting[]>((resolve, reject) => {
            const request = indexedDB.open('Focus', 1);

            request.onsuccess = (event) => {
                const db = (event.target as IDBRequest).result as IDBDatabase;
                const transaction = db.transaction('config', 'readonly');
                const objectStore = transaction.objectStore('config');
                const getAllRequest = objectStore.getAll();

                getAllRequest.onsuccess = () => {
                    resolve(getAllRequest.result);
                };

                getAllRequest.onerror = () => {
                    reject(getAllRequest.error);
                };
            };

            request.onerror = (event) => {
                reject((event.target as IDBRequest).error);
            };
        });
    }; try {
        const configData = await getConfigData();
        configData.forEach(setting => {
            switch (setting.key) {
                case 'autoStartFocus':
                    dispatch(setAutoStartFocus(Boolean(setting.value)));
                    break;
                case 'autoStartBreak':
                    dispatch(setAutoStartBreak(Boolean(setting.value)));
                    break;
                case 'longBreakInterval':
                    dispatch(setLongBreakInterval(Number(setting.value)));
                    break;
                case 'darkModeEnabled':
                    dispatch(setDarkTheme(Boolean(setting.value)));
                    break;
                case 'minutes':
                    dispatch(setMinutesFromConfig((setting.value) as Minutes));
                    break;
                case 'focusSessionCompleted':
                    dispatch(changeSessionCount({ focus: Number(setting.value), break: Number(setting.value) }));
                    break;
                case 'colorThemes':
                    dispatch(updateTheme({
                        focus: (setting.value as Theme).focus,
                        short: (setting.value as Theme).short,
                        long: (setting.value as Theme).long
                    }));
                    break;
                case 'alarmSound':
                    dispatch(setAlarmSound((setting.value as MusicType)));
                    break;
                case 'alarmSoundVolume':
                    dispatch(setAlarmVolume(Number(setting.value)));
                    break;
                case 'breakSound':
                    dispatch(setBreakSound(setting.value as MusicType));
                    break;
                case 'breakSoundVolume':
                    dispatch(setBreakVolume(Number(setting.value)));
                    break;
            }
        });
        return configData;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const fetchTagsOrProjectsAndSync = createAsyncThunk('database/fecthTagsOrProjects', async ({ key }: { key: 'tags' | 'projects' }, { dispatch, rejectWithValue }) => {
    const getTagsOrProjects = async () => {
        return new Promise<Tags | Projects>((resolve, reject) => {
            const request = indexedDB.open('Focus', 1);

            request.onsuccess = (event) => {
                const db = (event.target as IDBRequest).result as IDBDatabase;
                const transaction = db.transaction('activity', 'readonly').objectStore('activity');
                const tagsOrProjects = transaction.get(key);

                tagsOrProjects.onsuccess = () => {
                    resolve(tagsOrProjects.result);
                }

                tagsOrProjects.onerror = () => {
                    reject(tagsOrProjects.error);
                }
            }
        })
    }
    try {
        const tagsOrProjects = await getTagsOrProjects();
        if (tagsOrProjects.key === 'tags') {
            tagsOrProjects.value.forEach(tag => dispatch(addTagName({ tagName: tag.name, tagColorMark: tag.color })))
        } else {
            tagsOrProjects.value.forEach(project => dispatch(addProjectName({ projectName: project.name, projectColorMark: project.color })))
        }
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const updateConfigSettingsinDB = (db: IDBDatabase, key: string, value: Partial<Theme> | MusicType | number | Minutes) => {
    if (db) {
        const objectStore = db.transaction('config', 'readwrite').objectStore('config');
        objectStore.put({ key, value });
    }
}

export const updateActivityinDB = (db: IDBDatabase, key: 'tags' | 'projects', value: TagsAndProjects[]) => {
    if (db) {
        const objectStore = db.transaction('activity', 'readwrite').objectStore('activity');
        objectStore.put({ key, value });
    }
}