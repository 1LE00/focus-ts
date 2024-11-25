import DocumentPlus from "../../components/Tasks/DocumentPlus";
import Project from "../../components/Tasks/Project";
import Tag from "../../components/Tasks/Tag";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectFABModalState,
  toggleFloatingActionButtonModal,
} from "./FloatingActionButtonSlice";
import FloatingActionButton from "../../components/Buttons/FloatingActionButton";
import {
  setEstimatedPomodoroCount,
  setInputAddTaskValue,
  setProjectForTask,
  setTagsForTask,
  toggleTask,
} from "../tasks/taskSlice";
import {
  openAndResetCreateProjectModalStates,
  openAndResetCreateTagModalStates,
} from "../../utils/utils";

const FloatingActionButtonModal = () => {
  const isFABModalOpen = useAppSelector(selectFABModalState);
  const dispatch = useAppDispatch();

  const toggleFloatingActionButton = () => {
    dispatch(toggleFloatingActionButtonModal());
  };

  const openAddTaskModal = () => {
    dispatch(toggleFloatingActionButtonModal());
    dispatch(toggleTask({ taskModal: true }));
    dispatch(setInputAddTaskValue(""));
    dispatch(setEstimatedPomodoroCount(0));
    dispatch(setTagsForTask([]));
    dispatch(setProjectForTask({ name: "", color: "" }));
  };

  const openAddTagsModal = () => {
    dispatch(toggleFloatingActionButtonModal());
    openAndResetCreateTagModalStates(dispatch);
  };

  const openAddProjectsModal = () => {
    dispatch(toggleFloatingActionButtonModal());
    openAndResetCreateProjectModalStates(dispatch);
  };
  return (
    <section className="FAB fixed bottom-4 right-4 z-10 flex items-end">
      <FloatingActionButton
        toggleFloatingActionButton={toggleFloatingActionButton}
        innerModal={false}
      />
      {isFABModalOpen && (
        <section
          className="FAB-modal fixed inset-0 bg-black/75 backdrop-blur-sm"
          onClick={toggleFloatingActionButton}
        >
          <ul
            className="FAB-content absolute bottom-24 right-4 flex w-44 cursor-pointer flex-col rounded-lg bg-white px-6 text-xs text-black before:absolute before:-bottom-3 before:right-0 before:z-10 before:h-0 before:w-0 before:border-[12px] before:border-b-transparent before:border-l-transparent before:border-r-white before:border-t-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <li
              className="flex items-center gap-2 border-b border-b-black/20 py-5"
              onClick={openAddTaskModal}
            >
              <DocumentPlus
                fillColor="white"
                size="size-5"
                strokeColor="black"
              />
              <p className="text-sm font-medium">Add Tasks</p>
            </li>
            <li
              className="flex items-center gap-2 border-b border-b-black/20 py-5"
              onClick={openAddProjectsModal}
            >
              <Project fillColor="white" size="size-5" strokeColor="black" />
              <p className="text-sm font-medium">Add Projects</p>
            </li>
            <li
              className="flex items-center gap-2 py-5"
              onClick={openAddTagsModal}
            >
              <Tag fillColor="white" size="size-5" strokeColor="black" />
              <p className="text-sm font-medium">Add Tags</p>
            </li>
          </ul>
          <FloatingActionButton
            toggleFloatingActionButton={toggleFloatingActionButton}
            innerModal={true}
          />
        </section>
      )}
    </section>
  );
};
export default FloatingActionButtonModal;
