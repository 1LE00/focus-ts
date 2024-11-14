import { useAppSelector } from "../../app/hooks";
import { selectSessionCount } from "./sessionSlice";
import { selectActiveButton } from "../timer/timerSlice";

export const Session = () => {
    const activeButton = useAppSelector(selectActiveButton);
    const sessionCount = useAppSelector(selectSessionCount);
    return (
        <section className="session flex flex-col justify-center items-center">
            <h2 className="session-id text-white/50 text-sm min-[500px]:text-base">#{activeButton === 1 ? sessionCount.focus : sessionCount.break}</h2>
            <p className="text-sm">{activeButton === 1 ? 'Time to Focus!' : 'Time for a Break!'}</p>
            <p>Focus Session Completed: {sessionCount.focus - 1}</p>
        </section>
    )
}
