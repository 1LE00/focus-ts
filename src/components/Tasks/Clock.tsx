import { TaskSVGTypes } from "../../features/tasks/taskSlice";

const Clock = ({
  fillColor,
  size,
  strokeColor,
}: TaskSVGTypes<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={fillColor}
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke={strokeColor}
      className={size}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
};
export default Clock;
