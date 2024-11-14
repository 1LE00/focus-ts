import { useAppSelector } from "../../app/hooks";
import { selectProgressBar } from "./progressbarSlice";


export const Progressbar = () => {
  const progress = useAppSelector(selectProgressBar);
  return (
    <section className="w-full h-[1px] mt-2 bg-gray-700/20 max-w-[620px] rounded relative">
      <section className='h-1 bg-white rounded absolute -top-[2px]' style={{ width: `${progress}%` }}></section>
    </section>
  )
}
