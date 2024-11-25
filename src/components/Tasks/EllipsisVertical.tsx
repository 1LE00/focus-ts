import { forwardRef } from "react";
import { TaskSVGTypes } from "../../features/tasks/taskSlice";

const EllipsisVertical = forwardRef<SVGSVGElement, TaskSVGTypes<SVGSVGElement>>(
  ({ fillColor, size, strokeColor, toggleOptions }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={fillColor}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke={strokeColor}
        className={size}
        onClick={toggleOptions}
        ref={ref}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
        />
      </svg>
    );
  },
);
export default EllipsisVertical;
