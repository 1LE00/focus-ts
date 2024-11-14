import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Color, colors } from '../../config/colors';
import { RootState } from '../../app/store';

// * Theme defines the color scheme for different states in the app (focus, short break, long break, dark theme).
export interface Theme {
    focus: string,
    short: string,
    long: string,
    dark: string
};

interface ThemeState {
    theme: Theme,
    colors: Color[]
}

const initialState: ThemeState = {
    theme: {
        focus: "focus",
        short: "short",
        long: "long",
        dark: "dark",
    },
    colors: colors,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        updateTheme: (state, action: PayloadAction<Partial<Theme>>) => {
            state.theme = { ...state.theme, ...action.payload }
        }
    }
});

export const { updateTheme } = themeSlice.actions;
export const selectTheme = (state: RootState) => state.theme.theme;
export const selectColors = (state: RootState) => state.theme.colors;
export default themeSlice.reducer;
