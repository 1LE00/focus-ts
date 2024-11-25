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
    tasks: [
        {
            id: "1",
            name: "Complete report",
            tags: [
                { name: "Work", color: "#ff6347" }, // Tomato color
                { name: "Urgent", color: "#ff4500" } // OrangeRed color
            ],
            project: { name: "Project A", color: "#1e90ff" }, // DodgerBlue color
            isChecked: false,
            pomodoroCount: 3,
            note: "Remember to include the new financial data."
        },
        {
            id: "2",
            name: "Grocery shopping",
            tags: [
                { name: "Personal", color: "#32cd32" }, // LimeGreen color
                { name: "Errand", color: "#ffa500" } // Orange color
            ],
            project: { name: "Home", color: "#6a5acd" }, // SlateBlue color
            isChecked: false,
            pomodoroCount: 1,
            note: "Buy fruits, vegetables, and milk."
        },
        {
            id: "3",
            name: "Read a book",
            tags: [
                { name: "Leisure", color: "#ff69b4" }, // HotPink color
                { name: "Reading", color: "#8a2be2" } // BlueViolet color
            ],
            project: { name: "Personal Development", color: "#20b2aa" }, // LightSeaGreen color
            isChecked: false,
            pomodoroCount: 2,
            note: "Continue reading the second chapter."
        },
        {
            id: "4",
            name: "Workout",
            tags: [
                { name: "Health", color: "#00fa9a" }, // MediumSpringGreen color
                { name: "Fitness", color: "#ff4500" } // OrangeRed color
            ],
            project: { name: "Wellness", color: "#ff1493" }, // DeepPink color
            isChecked: false,
            pomodoroCount: 1,
            note: "Focus on cardio and core exercises."
        }
    ]

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
