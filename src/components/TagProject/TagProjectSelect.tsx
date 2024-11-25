import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Add from "../../components/Tasks/Add";
import Check from "../../components/Tasks/Check";
import Tag from "../../components/Tasks/Tag";
import { ListOfTags, selectListOfTags } from "../../features/tags/tagSlice";
import {
  ItemForTask,
  selectProjectForTask,
  selectTagsForTask,
  selectToggleTask,
  setProjectForTask,
  setTagsForTask,
  TaskToggle,
  toggleTask,
} from "../../features/tasks/taskSlice";
import {
  ListOfProjects,
  selectListOfProjects,
} from "../../features/projects/projectSlice";
import Project from "../Tasks/Project";
import {
  openAndResetCreateProjectModalStates,
  openAndResetCreateTagModalStates,
  showAndSetToastMessage,
} from "../../utils/utils";

interface TagProjectSelect {
  isSelection: string;
}

const TagProjectSelect = ({ isSelection }: TagProjectSelect) => {
  // * Selectors from slices
  const taskToogler = useAppSelector(selectToggleTask);
  const listOfProjects = useAppSelector(selectListOfProjects);
  const listOfTags = useAppSelector(selectListOfTags);
  const selectedProjectForTask = useAppSelector(selectProjectForTask);
  const selectedTagsForTask = useAppSelector(selectTagsForTask);
  const dispatch = useAppDispatch();
  // Local component states and variables
  const [selectedTag, setSelectedTag] = useState<Set<ItemForTask>>(new Set());
  const [selectedProject, setSelectedProject] = useState<ItemForTask>({
    name: "",
    color: "",
  });
  // * select array to iterate over in UL element
  const ArrayToIterate = isSelection === "tag" ? listOfTags : listOfProjects;

  // Close TagOrProject Selection
  const closeTagOrProjectSelection = () => {
    const modalToClose =
      isSelection === "tag" ? "tagModal" : ("projectModal" as keyof TaskToggle);
    dispatch(toggleTask({ [modalToClose]: false, taskModal: true }));
  };
  // * Open create TagOrProject Modal when clicked on +
  const openCreateTagOrProjectModal = () => {
    if (isSelection === "tag") {
      openAndResetCreateTagModalStates(dispatch);
    } else {
      openAndResetCreateProjectModalStates(dispatch);
    }
  };
  // * Store the checked values in a state for both Tag and Projects
  const selectATag = (name: string, color: string): void => {
    if (isSelection === "tag") {
      setSelectedTag((prev) => {
        const newTags = new Set(prev);
        const tagExist = [...newTags].some((tag) => tag.name === name);
        if (tagExist) {
          const filteredArray = [...newTags].filter((tag) => tag.name !== name);
          return new Set(filteredArray);
        }
        return newTags.add({ name: name, color: color });
      });
    } else {
      setSelectedProject((prev) =>
        prev.name === name
          ? { name: "", color: "" }
          : { name: name, color: color },
      );
    }
  };

  /**
   * This function helps TypeScript differentiate between ListOfProjects and ListOfTags
   * by verifying the presence of the `tagName` property, which is specific to ListOfTags.
   * @param item - The item to be checked, which can be either ListOfProjects or ListOfTags.
   * @returns {boolean} - Returns true if the item is of type ListOfTags, otherwise false.
   */
  const isTag = (item: ListOfProjects | ListOfTags): item is ListOfTags => {
    return (item as ListOfTags).tagName !== undefined;
  };

  const areArraysEqual = <T,>(arr1: T[], arr2: T[]): boolean => {
    if (arr1.length !== arr2.length) {
      return false;
    }
    return arr1.every((value, index) => value === arr2[index]);
  };

  const chooseTagAndProjectForTask = () => {
    if (isSelection === "tag") {
      if (selectedTag.size) {
        // * Only dispatch if user selects a different tag from before
        if (!areArraysEqual(selectedTagsForTask, Array.from(selectedTag))) {
          dispatch(setTagsForTask([...selectedTag]));
          showAndSetToastMessage(dispatch, {
            type: "tag",
            subtype: "tagsSelected",
            color: "#4ab057",
          });
        }
        closeTagOrProjectSelection();
      } else {
        showAndSetToastMessage(dispatch, {
          type: "tag",
          subtype: "noTags",
        });
      }
    } else {
      if (selectedProject.name) {
        if (selectedProject.name !== selectedProjectForTask.name) {
          dispatch(setProjectForTask(selectedProject));
          showAndSetToastMessage(dispatch, {
            type: "project",
            subtype: "projectSelected",
            color: "#4ab057",
          });
        }
        closeTagOrProjectSelection();
      } else {
        showAndSetToastMessage(dispatch, {
          type: "project",
          subtype: "noProject",
        });
      }
    }
  };

  useEffect(() => {
    if (taskToogler.taskModal) {
      setSelectedTag(new Set(selectedTagsForTask));
      setSelectedProject(selectedProjectForTask);
    }
  }, [selectedProjectForTask, selectedTagsForTask, taskToogler]);
  return (
    <section
      className={`${isSelection === "tag" ? "tag-selection-modal" : "project-selection-modal"} ${taskToogler[isSelection === "tag" ? "tagModal" : "projectModal"] ? "flex" : "hidden"} fixed inset-0 z-20 items-center justify-center bg-black/75 backdrop-blur-sm`}
      onClick={closeTagOrProjectSelection}
    >
      {/* Tag / Project selection content */}
      <section
        className="absolute bottom-0 left-0 flex w-full max-w-[375px] flex-col rounded-md bg-white p-4 min-[376px]:bottom-[unset] min-[376px]:left-[unset]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-b-black/10 pb-4">
          <h2 className="flex-grow text-center font-medium text-black">
            {isSelection === "tag" ? "Tags" : "Projects"}
          </h2>
          <Add
            fillColor="rgb(255, 99, 71)"
            size="size-5 cursor-pointer"
            strokeColor="rgb(255, 99, 71)"
            toggleOptions={openCreateTagOrProjectModal}
          />
        </header>
        <ul
          className={`list-of-${isSelection === "tag" ? "tags" : "projects"} max-h-96 overflow-y-auto`}
        >
          {ArrayToIterate.length ? (
            ArrayToIterate.map((item) => {
              if (isTag(item)) {
                return (
                  <li
                    key={item.tagName}
                    className="flex cursor-pointer items-center justify-between gap-4 border-b border-b-black/10 px-1 py-4 text-sm font-normal text-black/90"
                    onClick={() => selectATag(item.tagName, item.tagColorMark)}
                  >
                    <Tag
                      fillColor={item.tagColorMark}
                      strokeColor="white"
                      size="size-6"
                    />
                    <p className="flex-grow">{item.tagName}</p>
                    {[...selectedTag].some(
                      (tag) => tag.name === item.tagName,
                    ) && (
                      <Check
                        fillColor="rgb(255, 99, 71)"
                        size="size-5"
                        strokeColor="rgb(255, 99, 71)"
                      />
                    )}
                  </li>
                );
              } else {
                return (
                  <li
                    key={item.projectName}
                    className="flex cursor-pointer items-center justify-between gap-4 border-b border-b-black/10 px-1 py-4 text-sm font-normal text-black/90"
                    onClick={() =>
                      selectATag(item.projectName, item.projectColorMark)
                    }
                  >
                    <Project
                      fillColor={item.projectColorMark}
                      strokeColor="white"
                      size="size-6"
                    />
                    <p className="flex-grow">{item.projectName}</p>
                    {selectedProject.name === item.projectName && (
                      <Check
                        fillColor="rgb(255, 99, 71)"
                        size="size-5"
                        strokeColor="rgb(255, 99, 71)"
                      />
                    )}
                  </li>
                );
              }
            })
          ) : (
            <p className="py-4 text-sm text-black">
              {`No ${isSelection === "tag" ? "tags" : "projects"} available. Click the + icon to add ${isSelection === "tag" ? "tags" : "projects"}.`}
            </p>
          )}
        </ul>
        {ArrayToIterate.length && (
          <footer className="mt-4 flex justify-center gap-8">
            <button
              type="button"
              className="rounded-full bg-graye px-12 py-3 text-xs font-medium text-white"
              onClick={closeTagOrProjectSelection}
              title="Cancel"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-full bg-task px-12 py-3 text-xs font-medium text-white"
              title={
                isSelection === "tag"
                  ? "Add selected Tags"
                  : "Add selected Project"
              }
              onClick={chooseTagAndProjectForTask}
            >
              Ok
            </button>
          </footer>
        )}
      </section>
    </section>
  );
};
export default TagProjectSelect;
