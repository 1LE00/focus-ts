import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ColorMarkButton from "../../components/Buttons/ColorMarkButton";
import Add from "../../components/Tasks/Add";
import EllipsisVertical from "../../components/Tasks/EllipsisVertical";
import Project from "../../components/Tasks/Project";
import Tag from "../../components/Tasks/Tag";
import { projectAndTagColors } from "../../config/colors";
import {
  setTagName,
  setTagColor,
  selectToggleTagModal,
  selectListOfTags,
  addTagName,
  toggleCreateTagModal,
  ListOfTags,
} from "../../features/tags/tagSlice";
import {
  addProjectName,
  ListOfProjects,
  selectListOfProjects,
  selectToggleProjectModal,
  setProjectColor,
  setProjectName,
  toggleCreateProjectModal,
} from "../../features/projects/projectSlice";
import { showAndSetToastMessage } from "../../utils/utils";
import { updateActivityinDB } from "../../features/database/Thunks";
import { selectDatabase } from "../../features/database/DatabaseSlice";
import { TagsAndProjects } from "../../config/config";

type TagProjectModal = {
  isCreateTagOrProjectModalOpen: boolean;
  closeTagOrProjectModal: () => void;
  addTagOrProjectValue: string;
  tagOrProjectColor: string;
  isModal: string;
};

const TagProjectModal = ({
  isCreateTagOrProjectModalOpen,
  closeTagOrProjectModal,
  addTagOrProjectValue,
  tagOrProjectColor,
  isModal,
}: TagProjectModal) => {
  // Local component state and refs
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const ellipsisVerticalRef = useRef<SVGSVGElement>(null);
  const tagOrProjectModalRef = useRef<HTMLElement>(null);
  const tagOrProjectInputRef = useRef<HTMLInputElement>(null);
  // Hooks from store
  const isCreateProjectModalOpen = useAppSelector(selectToggleProjectModal);
  const listOfProjects = useAppSelector(selectListOfProjects);
  const isCreateTagModalOpen = useAppSelector(selectToggleTagModal);
  const listOfTags = useAppSelector(selectListOfTags);
  const dispatch = useAppDispatch();
  const db = useAppSelector(selectDatabase) as IDBDatabase;
  // Close options menu
  const closeOptionsMenu = (event: MouseEvent) => {
    if (
      tagOrProjectModalRef.current &&
      tagOrProjectModalRef.current.contains(event.target as Node)
    ) {
      setShowOptions(false);
    }
  };
  // Choose random colors for tags and project if not selected
  const chooseRandomColor = () => {
    const colorValues = projectAndTagColors.map((color) => color.value);
    const indexToChooseFrom = Math.floor(Math.random() * colorValues.length);
    return colorValues[indexToChooseFrom];
  };

  const handleNewTagOrProjectNameAddition = (
    type: "tag" | "project",
    exists: ListOfProjects | ListOfTags | undefined,
    choosenColor: string,
  ) => {
    const toggleAction =
      type === "tag" ? toggleCreateTagModal : toggleCreateProjectModal;
    if (!exists) {
      if (type === "tag") {
        dispatch(
          addTagName({
            tagName: addTagOrProjectValue,
            tagColorMark: choosenColor,
          }),
        );
        if (!listOfTags.length) {
          updateActivityinDB(db, "tags", [
            { name: addTagOrProjectValue, color: choosenColor },
          ]);
        }
      } else {
        dispatch(
          addProjectName({
            projectName: addTagOrProjectValue,
            projectColorMark: choosenColor,
          }),
        );
        if (!listOfProjects.length) {
          updateActivityinDB(db, "projects", [
            { name: addTagOrProjectValue, color: choosenColor },
          ]);
        }
      }
      dispatch(toggleAction());
      showAndSetToastMessage(dispatch, {
        type: type,
        name: addTagOrProjectValue,
        color: choosenColor,
        exists: false,
      });
    } else {
      showAndSetToastMessage(dispatch, {
        type: type,
        name: addTagOrProjectValue,
        color: choosenColor,
        exists: true,
      });
    }
  };

  // Add a new tagOrProject Name
  const addNewTagOrProjectName = () => {
    // * Return if user clicks add when input's length is empty
    if (!addTagOrProjectValue.length) {
      return tagOrProjectInputRef.current?.focus();
    }
    // * Choose a random color if user doesn't pick any color for the inputs
    const choosenColor = tagOrProjectColor
      ? tagOrProjectColor
      : chooseRandomColor();
    if (isModal === "tag") {
      const exists = listOfTags.find(
        (tag) => tag.tagName === addTagOrProjectValue,
      );
      handleNewTagOrProjectNameAddition("tag", exists, choosenColor);
    } else {
      const exists = listOfProjects.find(
        (project) => project.projectName === addTagOrProjectValue,
      );
      handleNewTagOrProjectNameAddition("project", exists, choosenColor);
    }
  };
  useEffect(() => {
    if (listOfTags.length) {
      const tags: TagsAndProjects[] = listOfTags.map((tag) => ({
        name: tag.tagName,
        color: tag.tagColorMark,
      }));
      updateActivityinDB(db, "tags", tags);
    }
  }, [listOfTags, db]);
  useEffect(() => {
    if (listOfProjects.length) {
      const projects: TagsAndProjects[] = listOfProjects.map((project) => ({
        name: project.projectName,
        color: project.projectColorMark,
      }));
      updateActivityinDB(db, "projects", projects);
    }
  }, [listOfProjects, db]);
  // Effect that adds a listener to tagOrProjectModal
  useEffect(() => {
    if (tagOrProjectModalRef.current) {
      const tagOrProjectModal = tagOrProjectModalRef.current;
      tagOrProjectModal.addEventListener("mousedown", closeOptionsMenu);
      return () => {
        tagOrProjectModal.removeEventListener("mousedown", closeOptionsMenu);
      };
    }
  }, []);
  // Focus on the inputs as soon as the create modal loads up
  useEffect(() => {
    if (isCreateProjectModalOpen || isCreateTagModalOpen) {
      if (tagOrProjectInputRef.current) {
        tagOrProjectInputRef.current.focus();
      }
    }
  }, [isCreateTagModalOpen, isCreateProjectModalOpen]);
  // Handle change in Input for TagOrProject Modal
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isModal === "tag") {
      dispatch(setTagName(event.target.value));
    } else {
      dispatch(setProjectName(event.target.value));
    }
  };
  // Pick a color for TagOrProject Modal when you create a new TagOrProject Name
  const handlePickAColor = (value: string) => {
    const chooseColorValue = tagOrProjectColor === value ? "" : value;
    if (isModal === "tag") {
      dispatch(setTagColor(chooseColorValue));
    } else {
      dispatch(setProjectColor(chooseColorValue));
    }
  };
  return (
    <section
      className={`${isModal === "tag" ? "tag-modal" : "project-modal"} ${isCreateTagOrProjectModalOpen ? "flex" : "hidden"} fixed inset-0 z-30 items-center justify-center bg-black/75 backdrop-blur-sm`}
      ref={tagOrProjectModalRef}
      onClick={closeTagOrProjectModal}
    >
      {/* Tag / Project Modal content */}
      <section
        className="absolute bottom-0 left-0 flex h-[550px] w-full max-w-[320px] flex-col rounded-lg bg-slate-50 p-4 min-[321px]:bottom-[unset] min-[321px]:left-[unset]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="relative flex items-center justify-between border-b border-b-black/5 pb-2 text-black/90">
          <Add
            fillColor="black"
            strokeColor="black"
            size="size-6 rotate-45 cursor-pointer"
            toggleOptions={closeTagOrProjectModal}
          />
          <h2 className="flex flex-grow justify-center font-medium">
            Add New {isModal === "tag" ? "Tag" : "Project"}
          </h2>
          <EllipsisVertical
            fillColor="black"
            strokeColor="black"
            size="size-6 cursor-pointer"
            toggleOptions={() => setShowOptions(!showOptions)}
            ref={ellipsisVerticalRef}
          />
          {showOptions && (
            <section className="absolute -bottom-12 right-0 flex cursor-pointer items-center gap-2 rounded-md bg-white p-4 text-xs shadow-xl">
              <Project fillColor="white" strokeColor="black" size="size-4" />
              <p>Manage Projects & Tags</p>
            </section>
          )}
        </header>
        {/* Input tag/project name */}
        <section className="mt-6">
          <h3 className="text-sm font-medium text-black/90">
            {isModal === "tag" ? "Tag" : "Project"} Name
          </h3>
          <section className="mb-4 mt-2 flex items-center gap-2 rounded-lg bg-gray-500/5 pl-4">
            {isModal === "tag" ? (
              <Tag fillColor="white" size="size-4" strokeColor="black" />
            ) : (
              <Project fillColor="white" size="size-4" strokeColor="black" />
            )}
            <input
              type="text"
              name={isModal === "tag" ? "add-tag" : "add-project"}
              id={isModal === "tag" ? "add-tag" : "add-project"}
              placeholder={isModal === "tag" ? "Tag Name" : "Project Name"}
              value={addTagOrProjectValue}
              onChange={(e) => handleInputChange(e)}
              className="w-full py-4 pr-4 text-xs text-black"
              ref={tagOrProjectInputRef}
            />
          </section>
        </section>
        <h3 className="mb-4 text-sm font-medium text-black/90">
          {isModal === "tag" ? "Tag" : "Project"} Color Mark
        </h3>
        <section className="tag-color-picker flex flex-wrap gap-[1.06rem]">
          {projectAndTagColors.map(({ name, value }) => (
            <ColorMarkButton
              key={name}
              color={name}
              renderSvg={tagOrProjectColor === value}
              title={name}
              pickAColor={() => handlePickAColor(value)}
            />
          ))}
        </section>
        <footer className="mb-4 mt-auto flex justify-center gap-8">
          <button
            type="button"
            className="rounded-full bg-graye px-12 py-3 text-xs font-medium text-white"
            onClick={closeTagOrProjectModal}
            title="Cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            className={`rounded-full px-12 py-3 text-xs font-medium text-white ${addTagOrProjectValue ? "bg-task" : "cursor-not-allowed bg-orange"}`}
            title={isModal === "tag" ? "Add a new tag" : "Add a new project"}
            onClick={addNewTagOrProjectName}
          >
            Add
          </button>
        </footer>
      </section>
    </section>
  );
};
export default TagProjectModal;
