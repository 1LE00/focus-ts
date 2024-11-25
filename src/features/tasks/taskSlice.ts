import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { capitalizeFirstLetter } from "../../utils/utils";

export type TaskToggle = {
    taskModal: boolean;
    tagModal: boolean;
    projectModal: boolean;
};

export interface TaskSVGTypes<T> {
    fillColor: string;
    size: string;
    strokeColor: string;
    toggleOptions?: () => void;
    ref?: React.RefObject<T>;
}

export interface ItemForTask {
    name: string;
    color: string;
}

export interface Task {
    id: string,
    name: string,
    tags: ItemForTask[],
    project: ItemForTask,
    isChecked: boolean,
    pomodoroCount: number,
    note: string
}

interface TaskSlice {
    toggle: Partial<TaskToggle>;
    inputAddTaskValue: string;
    estimatedPomodoroCount: number;
    tagsForTask: ItemForTask[];
    projectForTask: ItemForTask;
    tasks: Task[]
}

const initialState: TaskSlice = {
    toggle: {
        taskModal: false,
        tagModal: false,
        projectModal: false,
    },
    inputAddTaskValue: "",
    estimatedPomodoroCount: 0,
    tagsForTask: [],
    projectForTask: {
        name: '',
        color: ''
    },
    tasks: []
};

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        toggleTask: (state, action: PayloadAction<Partial<TaskToggle>>) => {
            state.toggle = { ...state.toggle, ...action.payload };
        },
        setInputAddTaskValue: (state, action: PayloadAction<string>) => {
            state.inputAddTaskValue = capitalizeFirstLetter(action.payload);
        },
        setEstimatedPomodoroCount: (state, action: PayloadAction<number>) => {
            state.estimatedPomodoroCount = action.payload;
        },
        setProjectForTask: (state, action: PayloadAction<ItemForTask>) => {
            state.projectForTask = action.payload;
        },
        setTagsForTask: (state, action: PayloadAction<ItemForTask[]>) => {
            state.tagsForTask = action.payload;
        },
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload)
        },
        emptyTask: (state) => {
            state.tasks = [];
        }
    },
});

export const selectToggleTask = (state: RootState) => state.tasks.toggle;
export const selectInputAddTaskValue = (state: RootState) =>
    state.tasks.inputAddTaskValue;
export const selectEstimatedPomodoroCount = (state: RootState) =>
    state.tasks.estimatedPomodoroCount;
export const selectProjectForTask = (state: RootState) =>
    state.tasks.projectForTask;
export const selectTagsForTask = (state: RootState) =>
    state.tasks.tagsForTask;
export const selectTasks = (state: RootState) =>
    state.tasks.tasks;

export const {
    toggleTask,
    setInputAddTaskValue,
    setEstimatedPomodoroCount,
    setProjectForTask,
    setTagsForTask,
    addTask,
    emptyTask
} = taskSlice.actions;

export default taskSlice.reducer;
