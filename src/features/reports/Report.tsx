import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectToggle, setToggle } from "../settings/settingsSlice";

const Report = () => {
  const toggle = useAppSelector(selectToggle);
  const dispatch = useAppDispatch();
  const closeModal = () => {
    dispatch(
      setToggle({
        reports: false,
        settings: false,
      }),
    );
  };
  return (
    <section
      className={`${toggle.reports ? "flex" : "hidden"} fixed inset-0 z-10 justify-center bg-black/75`}
      onClick={closeModal}
    >
      <section
        className={`${toggle.reports ? "flex" : "hidden"} relative top-11 m-3 h-modal-custom w-modal-custom max-w-sm flex-col rounded-md bg-slate-50 pt-4`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="ml-4 flex w-modal-custom items-center justify-between border-b border-black/20 pb-2 text-gray-500">
          <h2 className="flex-grow text-center text-sm font-medium uppercase">
            Reports
          </h2>
          <button
            type="button"
            aria-label="close reports modal"
            onClick={closeModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </header>
        <section className="modal-body flex h-20 items-center justify-center overflow-auto px-4 text-sm font-medium text-black">
          Coming soon...
        </section>
      </section>
    </section>
  );
};
export default Report;
