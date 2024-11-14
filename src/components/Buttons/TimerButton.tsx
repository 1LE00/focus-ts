import { Theme } from "../../features/theme/themeSlice"

type TimerButtonProps = {
    activeButton: number,
    theme: Theme,
    handleButtonClick: (buttonId: number) => void,
    title: string,
    buttonId: number
}

export const TimerButton = ({ activeButton, theme, handleButtonClick, title, buttonId }: TimerButtonProps) => {
    type BackgroundTheme = {
        [key: number]: string
    }

    const backgroundTheme: BackgroundTheme = {
        1: theme.focus,
        2: theme.short,
        3: theme.long
    }
    return (
        <button type="button" className={`text-xs ${activeButton === buttonId ? `bg-${backgroundTheme[activeButton]} font-semibold` : 'bg-transparent font-medium lg:hover:bg-white/25 transition-colors duration-200 ease-in'} p-2 rounded min-[500px]:text-sm min-[500px]:py-2 min-[500px]:px-4`} onClick={() => handleButtonClick(1)}>{title}</button>
    )
}