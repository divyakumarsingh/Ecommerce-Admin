import { useSession } from "next-auth/react";
import SideBar from "./SideBar";

export default function Layout({ children }) {
    const { data: session } = useSession();

    return <div className={"bg-blue-900 h-screen flex p-2"}>
        <SideBar />
        <div className={'flex-grow flex flex-col'}>
            <div className={'p-2 pt-0 justify-end items-center flex gap-2 text-white bold'}>
                <img src={session?.user.image} className={'rounded-full h-8' }/>
                <div>
                    <span className={'text-xs'}>
                        {session?.user?.name}
                    </span>
                </div>
            </div>
            <div className="bg-white rounded-lg flex-grow p-4">
                {children}
            </div>

        </div>
    </div>
}