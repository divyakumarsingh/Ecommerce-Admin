import Link from "next/link";
import { useRouter } from "next/router";
import { menuItems } from "utils/menuItems";

export default function Nav() {
    const router= useRouter();
    return (
        <nav>
            {
                menuItems.map((menu) => (
                    <Link key={menu.id} href={menu.path} className={`flex rounded-l-lg ml-2 p-2 gap-2 font-semibold ${ router.pathname===menu.path? 'text-blue-900 bg-white': 'text-white bg-blue-900' }`}>
                        {menu.icon}
                        <span>
                            {menu.title}
                        </span>
                    </Link>
                ))
            }
        </nav>
    )
}
