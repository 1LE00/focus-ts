import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  clearToastMessage,
  selectShowToast,
  selectToastMessage,
} from "./toastSlice";
import Tag from "../../components/Tasks/Tag";
import Project from "../../components/Tasks/Project";

const Toast = () => {
  const show = useAppSelector(selectShowToast);
  const message = useAppSelector(selectToastMessage);
  const dispatch = useAppDispatch();

  const timeoutRef = useRef<number | null>(null);
  const closeToast = useCallback(() => {
    dispatch(clearToastMessage());
  }, [dispatch]);

  useEffect(() => {
    if (show) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(closeToast, 3000);
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [closeToast, show, message]);

  return (
    <section
      className={`${show ? "visible right-0 top-4 opacity-100 md:right-8 md:top-8" : "invisible right-0 top-0 opacity-0 md:top-8"} fixed z-40 mx-4 flex max-w-sm items-center gap-2 rounded-md bg-white p-4 shadow-2xl transition-all duration-500 ease-in md:mx-0`}
    >
      {message.type === "tag" && message.color ? (
        <Tag
          fillColor={message.color}
          strokeColor="white"
          size="size-4 md:size-5"
        />
      ) : message.type === "project" && message.color ? (
        <Project
          fillColor={message.color}
          strokeColor="white"
          size="size-4 md:size-5"
        />
      ) : null}
      <p className="text-xs font-medium text-black md:text-sm">
        {message.info}
      </p>
    </section>
  );
};
export default Toast;
