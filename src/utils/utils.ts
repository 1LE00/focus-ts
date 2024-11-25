import { AppDispatch } from "../app/store";
import {
    setProjectColor,
    setProjectName,
    toggleCreateProjectModal,
} from "../features/projects/projectSlice";
import {
    toggleCreateTagModal,
    setTagName,
    setTagColor,
} from "../features/tags/tagSlice";
import { setToastMessage } from "../features/toasts/toastSlice";

/** 
 * @param {string} string - A string whose first letter is to be capitalized
 * @returns {string} - Unmodified string if the first letter is already capitalized
 *                     else returns modified string with first letter being capitalized
 */
export const capitalizeFirstLetter = (string: string): string => {
    if (string.charAt(0) !== string.charAt(0).toUpperCase()) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
}
/**
 * @param {string} text - A string whose first letter of every word is to be capitalized
 * @returns {string} - String with capitalized first letter of it's every word
 */
export const capitalizeFirstLetters = (text: string): string => {
    return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};
/**
 * Opens the Create Tag Modal and resets the tag name and color to their initial states.
 * @param {AppDispatch} dispatch - The dispatch function from redux store to send actions 
 */
export const openAndResetCreateTagModalStates = (dispatch: AppDispatch): void => {
    dispatch(toggleCreateTagModal());
    dispatch(setTagName(""));
    dispatch(setTagColor(""));
};
/**
 * Opens the Create Project Modal and resets the project name and color to their initial states.
 * @param {AppDispatch} dispatch - The dispatch function from redux store to send actions 
 */
export const openAndResetCreateProjectModalStates = (dispatch: AppDispatch): void => {
    dispatch(toggleCreateProjectModal());
    dispatch(setProjectName(""));
    dispatch(setProjectColor(""));
};

/**  
 * Displays a toast message with specific details and sets its properties based on the options provided. 
 * @param {AppDispatch} dispatch - The dispatch function from the Redux store to send actions. 
 * @param {Object} options - An object containing the parameters for the toast message. 
 * @param {string} [options.type] - The type of the toast message (e.g., 'tag', 'project', 'task'). 
 * @param {string} [options.name] - The name to be included in the message when you create a new tag or project. 
 * @param {string} [options.color] - The color for the tag or project SVG. 
 * @param {boolean} [options.exists] - Flag indicating if the item already exists. 
 * @param {string} [options.subtype] - Subtype of the type, if it exists. 
 */

export const showAndSetToastMessage = (dispatch: AppDispatch, options: {
    type: "tag" | 'project' | 'task',
    name?: string,
    color?: string,
    exists?: boolean,
    subtype?: 'maxLengthExceeded' | 'noPomodoroCount' | 'noTags' | 'noProject' | 'taskCreated' | 'tagsSelected' | 'projectSelected'
}): void => {
    const { type, name = '', color = '', exists = false, subtype = '' } = options;
    let message = '';
    switch (type) {
        case 'tag':
        case 'project':
            if (subtype === 'noTags') {
                message = `Choose one or more tags for the task by clicking on them`;
            } else if (subtype === 'noProject') {
                message = `Choose a project by clicking on it`;
            } else if (subtype === 'tagsSelected') {
                message = `Tags selected`;
            }
            else if (subtype === 'projectSelected') {
                message = `Project selected`;
            }
            else {
                message = `${capitalizeFirstLetter(type)} '${name}' has ${exists ? 'already been' : 'been'} added`;
            }
            break;
        case 'task':
            if (subtype === 'maxLengthExceeded') {
                message = `Task could not be added because it exceeds the maximum length`;
            }
            else if (subtype === 'noPomodoroCount') {
                message = `Please select the number of pomodoros you estimate for this task`;
            }
            else if (subtype === 'noTags') {
                message = `Please chose tags to categorize this task`;
            }
            else if (subtype === 'noProject') {
                message = `Please select a project name for the task`;
            }
            else if (subtype === 'taskCreated') {
                message = `${exists ? `${name} already exists` : 'Task has been added'}`;
            }
    }
    dispatch(setToastMessage({
        type: type,
        info: message,
        color: color,
    }),);
};