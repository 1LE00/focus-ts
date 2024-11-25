import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store';
import { capitalizeFirstLetters } from '../../utils/utils';

export interface ListOfProjects {
    projectName: string,
    projectColorMark: string
}

interface ProjectSlice {
    projectName: string,
    createProjectModal: boolean,
    projectColor: string,
    listOfProjects: ListOfProjects[]
}

const initialState: ProjectSlice = {
    projectName: '',
    createProjectModal: false,
    projectColor: '',
    listOfProjects: []
}

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        setProjectName: (state, action: PayloadAction<string>) => {
            state.projectName = capitalizeFirstLetters(action.payload);
        },
        toggleCreateProjectModal: (state) => {
            state.createProjectModal = !state.createProjectModal
        },
        setProjectColor: (state, action: PayloadAction<string>) => {
            state.projectColor = action.payload
        },
        addProjectName: (state, action: PayloadAction<ListOfProjects>) => {
            state.listOfProjects.push(action.payload);
        }
    }
});

export const { setProjectName, toggleCreateProjectModal, setProjectColor, addProjectName } = projectSlice.actions

export const selectProjectName = (state: RootState) => state.projects.projectName
export const selectProjectColor = (state: RootState) => state.projects.projectColor
export const selectToggleProjectModal = (state: RootState) => state.projects.createProjectModal
export const selectListOfProjects = (state: RootState) => state.projects.listOfProjects
export default projectSlice.reducer