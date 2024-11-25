import { useAppDispatch, useAppSelector } from "../../app/hooks";
import TagProjectModal from "../../components/TagProject/TagProjectModal";
import {
  selectProjectColor,
  selectProjectName,
  selectToggleProjectModal,
  toggleCreateProjectModal,
} from "./projectSlice";

const CreateProject = () => {
  const isCreateProjectModalOpen = useAppSelector(selectToggleProjectModal);
  const addProjectValue = useAppSelector(selectProjectName);
  const projectColor = useAppSelector(selectProjectColor);
  const dispatch = useAppDispatch();
  const closeProjectModal = () => {
    dispatch(toggleCreateProjectModal());
  };
  return (
    <TagProjectModal
      isCreateTagOrProjectModalOpen={isCreateProjectModalOpen}
      addTagOrProjectValue={addProjectValue}
      tagOrProjectColor={projectColor}
      closeTagOrProjectModal={closeProjectModal}
      isModal="project"
    />
  );
};
export default CreateProject;
