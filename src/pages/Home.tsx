import FloatingActionButtonModal from "../features/FloatingActionButton/FloatingActionButtonModal";
import { Progressbar } from "../features/progressbar/Progressbar";
import CreateProject from "../features/projects/CreateProject";
import SelectProject from "../features/projects/SelectProject";
import { Session } from "../features/session/Session";
import CreateTag from "../features/tags/CreateTag";
import SelectTag from "../features/tags/SelectTag";
import DisplayTask from "../features/tasks/DisplayTask";
import Tasks from "../features/tasks/Tasks";
import { Timer } from "../features/timer/Timer";
import Toast from "../features/toasts/Toast";

const Home = () => {
  return (
    <>
      <Progressbar />
      <Timer />
      <Session />
      <DisplayTask />
      <Tasks />
      <CreateTag />
      <SelectTag />
      <CreateProject />
      <SelectProject />
      <FloatingActionButtonModal />
      <Toast />
    </>
  );
};
export default Home;
