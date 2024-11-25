import { useAppDispatch, useAppSelector } from "../../app/hooks";
import TagProjectModal from "../../components/TagProject/TagProjectModal";
import {
  selectTagColor,
  selectTagName,
  selectToggleTagModal,
  toggleCreateTagModal,
} from "./tagSlice";

const CreateTag = () => {
  const isCreateTagModalOpen = useAppSelector(selectToggleTagModal);
  const addTagValue = useAppSelector(selectTagName);
  const tagColor = useAppSelector(selectTagColor);
  const dispatch = useAppDispatch();
  const closeTagModal = () => {
    dispatch(toggleCreateTagModal());
  };
  return (
    <TagProjectModal
      isCreateTagOrProjectModalOpen={isCreateTagModalOpen}
      addTagOrProjectValue={addTagValue}
      tagOrProjectColor={tagColor}
      closeTagOrProjectModal={closeTagModal}
      isModal="tag"
    />
  );
};
export default CreateTag;
