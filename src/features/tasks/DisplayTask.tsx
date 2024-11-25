import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import Clock from "../../components/Tasks/Clock";
import Play from "../../components/Tasks/Play";
import Project from "../../components/Tasks/Project";
import { selectTasks } from "./taskSlice";
import Check from "../../components/Tasks/Check";

const DisplayTask = () => {
  const tasks = useAppSelector(selectTasks);
  const initialCheckedState: { [key: string]: boolean } = tasks.reduce(
    (acc, task) => {
      acc[task.id] = false;
      return acc;
    },
    {} as { [key: string]: boolean },
  );

  const [checked, setChecked] = useState<{ [key: string]: boolean }>(
    initialCheckedState,
  );

  const handleCheckBoxChange = (taskId: string) => {
    setChecked((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };
  return (
    <section className="flex w-full max-w-[430px] flex-col gap-8">
      {tasks.map((task) => {
        return (
          <section
            key={task.id}
            style={{ borderLeftColor: task.tags[0].color }}
            className={`flex items-start gap-4 rounded-md border-l-4 bg-white p-4`}
          >
            <section className="checkbox-holder relative">
              <input
                type="checkbox"
                name={task.name}
                id={task.id}
                className={`border-3 h-6 w-6 flex-shrink-0 basis-6 rounded-full border-solid border-task ${checked[task.id] ? "bg-task" : "bg-white"}`}
                checked={checked[task.id]}
                onChange={() => handleCheckBoxChange(task.id)}
              />
              {checked[task.id] && (
                <Check
                  fillColor="white"
                  size="size-4 absolute top-1 left-1"
                  strokeColor="white"
                  toggleOptions={() => handleCheckBoxChange(task.id)}
                />
              )}
            </section>
            <section className="task-description flex flex-grow flex-col gap-2">
              <h2 className="break-all text-sm font-medium leading-5 text-black">
                {task.name}
              </h2>
              <section className="tags flex flex-wrap gap-4">
                {task.tags.map((tag) => {
                  return (
                    <p
                      style={{ color: tag.color }}
                      className={`text-xs`}
                      key={tag.name}
                    >{`#${tag.name}`}</p>
                  );
                })}
              </section>
              <footer className="flex gap-2">
                <section className="pomodoro flex items-center gap-2">
                  <section className="icon">
                    <Clock
                      size="size-4"
                      fillColor="white"
                      strokeColor="rgb(255, 99, 71)"
                    />
                  </section>
                  <p className="text-xs font-medium text-[#a6a6a6]">
                    {task.pomodoroCount}
                  </p>
                </section>
                <section className="project flex items-center gap-2">
                  <section className="icon">
                    <Project
                      size="size-4"
                      fillColor={task.project.color}
                      strokeColor="white"
                    />
                  </section>
                  <p className={`text-xs font-medium text-[#a6a6a6]`}>
                    {task.project.name}
                  </p>
                </section>
              </footer>
            </section>
            <button type="button" className="flex-shrink-0">
              <Play
                size="size-8"
                fillColor="rgb(255, 99, 71)"
                strokeColor="white"
              />
            </button>
          </section>
        );
      })}
    </section>
  );
};
export default DisplayTask;
