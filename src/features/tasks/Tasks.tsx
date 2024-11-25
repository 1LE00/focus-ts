import { useEffect, useRef } from "react";
import Project from "../../components/Tasks/Project";
import Tag from "../../components/Tasks/Tag";
import PomodoroButton from "../../components/Buttons/PomodoroButton";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addTask,
  selectEstimatedPomodoroCount,
  selectInputAddTaskValue,
  selectProjectForTask,
  selectTagsForTask,
  selectTasks,
  selectToggleTask,
  setEstimatedPomodoroCount,
  setInputAddTaskValue,
  Task,
  toggleTask,
} from "./taskSlice";
import { showAndSetToastMessage } from "../../utils/utils";
import { nanoid } from "@reduxjs/toolkit";

const Tasks = () => {
  const taskToogler = useAppSelector(selectToggleTask);
  const addTaskValue = useAppSelector(selectInputAddTaskValue);
  const pomodoroCount = useAppSelector(selectEstimatedPomodoroCount);
  const selectedProjectForTask = useAppSelector(selectProjectForTask);
  const selectedTagsForTask = useAppSelector(selectTagsForTask);
  const tasksArray = useAppSelector(selectTasks);
  const dispatch = useAppDispatch();
  // * Component state and refs
  const addTaskRef = useRef<HTMLInputElement>(null);

  const closeTaskModal = () => {
    dispatch(toggleTask({ taskModal: false }));
  };
  const openTagSelectionModal = () => {
    dispatch(toggleTask({ tagModal: true, taskModal: false }));
  };
  const openProjectSelectionModal = () => {
    dispatch(toggleTask({ projectModal: true, taskModal: false }));
  };

  const handleAddTask = () => {
    if (!addTaskValue.length) {
      return addTaskRef.current?.focus();
    }
    if (addTaskValue.length > 75) {
      showAndSetToastMessage(dispatch, {
        type: "task",
        subtype: "maxLengthExceeded",
      });
      return addTaskRef.current?.focus();
    }
    if (pomodoroCount === 0) {
      return showAndSetToastMessage(dispatch, {
        type: "task",
        subtype: "noPomodoroCount",
      });
    }
    if (!selectedTagsForTask.length) {
      return showAndSetToastMessage(dispatch, {
        type: "task",
        subtype: "noTags",
      });
    }
    if (!selectedProjectForTask.name) {
      return showAndSetToastMessage(dispatch, {
        type: "task",
        subtype: "noProject",
      });
    }
    const task: Task = {
      id: nanoid(),
      name: addTaskValue,
      tags: selectedTagsForTask,
      project: selectedProjectForTask,
      pomodoroCount: pomodoroCount,
      isChecked: false,
      note: "",
    };
    const existingTask = tasksArray.find((task) => task.name === addTaskValue);
    if (existingTask) {
      showAndSetToastMessage(dispatch, {
        type: "task",
        name: addTaskValue,
        subtype: "taskCreated",
        exists: true,
      });
    } else {
      dispatch(addTask(task));
      showAndSetToastMessage(dispatch, {
        type: "task",
        subtype: "taskCreated",
      });
      closeTaskModal();
    }
    // Todo complete this and add some options in settings for task like estimated pomodoros, auto select color
  };
  // * Focus on input when the modal opens
  useEffect(() => {
    if (addTaskRef.current) {
      addTaskRef.current.focus();
    }
  }, [taskToogler.taskModal]);
  return (
    <section
      className={`tasks-modal ${taskToogler.taskModal ? "flex" : "hidden"} fixed inset-0 z-20 items-center justify-center bg-black/75 backdrop-blur-sm`}
      onClick={closeTaskModal}
    >
      {/* Task Modal content */}
      <section
        className="absolute bottom-0 left-0 h-48 w-full max-w-[500px] rounded-md bg-slate-50 p-4 min-[500px]:bottom-[unset] min-[500px]:left-[unset]"
        onClick={(e) => e.stopPropagation()}
      >
        <form name="task form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="add task" className="sr-only">
            Add a task
          </label>
          <input
            type="text"
            name="add-task"
            id="add task"
            placeholder="Add a task"
            className="w-full rounded-sm p-2 text-sm font-medium text-black placeholder:text-xs"
            value={addTaskValue}
            ref={addTaskRef}
            maxLength={75}
            onChange={(e) => dispatch(setInputAddTaskValue(e.target.value))}
          />
          <hr className="mb-4 mt-2 h-[1.5px] w-full bg-gray-500/15" />
          <h2 className="text-xs font-medium text-black/75">
            Estimated Pomodoros
          </h2>
          <section className="pomodoro-count-wrapper mt-2 flex w-full gap-4 overflow-x-auto">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((value) => {
              return (
                <PomodoroButton
                  key={value}
                  value={value}
                  selectPomodoroCount={() => {
                    dispatch(setEstimatedPomodoroCount(value));
                  }}
                  isActive={value === pomodoroCount}
                />
              );
            })}
          </section>
          <hr className="my-3 h-[1.5px] w-full bg-gray-500/15" />
          <footer className="flex items-center justify-between gap-4">
            <section className="flex gap-4">
              <Tag
                fillColor={
                  selectedTagsForTask.length
                    ? selectedTagsForTask[0].color
                    : "white"
                }
                size="size-6 cursor-pointer"
                strokeColor={selectedTagsForTask.length ? "white" : "black"}
                toggleOptions={openTagSelectionModal}
              />
              <Project
                fillColor={
                  selectedProjectForTask.name
                    ? selectedProjectForTask.color
                    : "white"
                }
                size="size-6 cursor-pointer"
                strokeColor={selectedProjectForTask.name ? "white" : "black"}
                toggleOptions={openProjectSelectionModal}
              />
            </section>
            <button
              type="submit"
              className={`rounded-full px-8 py-2 text-xs font-medium text-white ${addTaskValue ? "bg-task" : "cursor-not-allowed bg-orange"}`}
              title="Add a Task"
              onClick={handleAddTask}
            >
              Add
            </button>
          </footer>
        </form>
      </section>
    </section>
  );
};
export default Tasks;
