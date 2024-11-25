import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store';
import { capitalizeFirstLetters } from '../../utils/utils';

export interface ListOfTags {
    tagName: string,
    tagColorMark: string
}

interface TagSlice {
    tagName: string,
    createTagModal: boolean,
    tagColor: string,
    listOfTags: ListOfTags[]
}

const initialState: TagSlice = {
    tagName: '',
    createTagModal: false,
    tagColor: '',
    listOfTags: []
}

const tagSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        setTagName: (state, action: PayloadAction<string>) => {
            state.tagName = capitalizeFirstLetters(action.payload)
        },
        toggleCreateTagModal: (state) => {
            state.createTagModal = !state.createTagModal
        },
        setTagColor: (state, action: PayloadAction<string>) => {
            state.tagColor = action.payload;
        },
        addTagName: (state, action: PayloadAction<ListOfTags>) => {
            const exists = state.listOfTags.some(tag => tag.tagName === action.payload.tagName);
            if (!exists) {
                state.listOfTags.push(action.payload);
            }
        }

    }
});
export const { setTagName, toggleCreateTagModal, setTagColor, addTagName } = tagSlice.actions

export const selectTagName = (state: RootState) => state.tags.tagName
export const selectToggleTagModal = (state: RootState) => state.tags.createTagModal
export const selectTagColor = (state: RootState) => state.tags.tagColor
export const selectListOfTags = (state: RootState) => state.tags.listOfTags

export default tagSlice.reducer