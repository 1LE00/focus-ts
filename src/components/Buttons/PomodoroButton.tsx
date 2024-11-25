type PomodoroButton = {
  value: number;
  selectPomodoroCount: () => void;
  isActive: boolean;
};

const PomodoroButton = ({
  value,
  selectPomodoroCount,
  isActive,
}: PomodoroButton) => {
  return (
    <button
      type="button"
      className={`duration-400 flex h-0 w-0 items-center justify-center rounded-full p-3 text-xs font-semibold transition-colors ease-in ${isActive ? "bg-task text-white" : "text-black/90"}`}
      onClick={selectPomodoroCount}
    >
      {value}
    </button>
  );
};
export default PomodoroButton;
