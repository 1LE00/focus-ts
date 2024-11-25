import Check from "../Tasks/Check";

type ColorMarkButton = {
  color: string;
  renderSvg: boolean;
  title: string;
  pickAColor: () => void;
};

const ColorMarkButton = ({
  color,
  renderSvg,
  title,
  pickAColor,
}: ColorMarkButton) => {
  return (
    <button
      type="button"
      title={title}
      className={`bg-${color} flex h-11 w-11 items-center justify-center rounded-full`}
      onClick={pickAColor}
    >
      {renderSvg && (
        <Check fillColor="white" size="size-5" strokeColor="white" />
      )}
    </button>
  );
};
export default ColorMarkButton;
