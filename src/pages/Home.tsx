import { Progressbar } from "../features/progressbar/Progressbar"
import { Session } from "../features/session/Session"
import { Timer } from "../features/timer/Timer"

const Home = () => {
    return (<>
        <Progressbar />
        <Timer />
        <Session />
    </>
    )
}
export default Home