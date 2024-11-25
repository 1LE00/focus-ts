import Add from "../Tasks/Add";

type FAB = {
  toggleFloatingActionButton: () => void;
  innerModal: boolean;
};

const FloatingActionButton = ({
  toggleFloatingActionButton,
  innerModal,
}: FAB) => {
  return (
    <button
      type="button"
      title={`${innerModal ? "Close" : "Open"} Floating Action Button`}
      className={`shadow-fab flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl ${innerModal ? "fixed bottom-4 right-4 rotate-45" : "static"}`}
      /* Don't allow onclick event for button inside the modal as it overlaps with the modal window */
      onClick={
        !innerModal ? toggleFloatingActionButton : (e) => e.preventDefault()
      }
    >
      <Add fillColor="black" strokeColor="black" size="size-5" />
    </button>
  );
};
export default FloatingActionButton;
