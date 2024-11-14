import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <section
            className={`Auth bg-focus min-h-screen p-4 flex flex-col gap-4 items-center justify-center w-100`}
        >
            <Link to='/' className={`flex gap-1 justify-center items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" className="size-12 min-[500px]:size-20">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                </svg>
                <h1 className="font-semibold text-4xl min-[500px]:text-6xl">Focus</h1>
            </Link>
            <Outlet />
        </section>
    );
}
