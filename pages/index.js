import Layout from "@/components/Layout";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  
  if (!session) { 
    return (
      <div className={"bg-blue-900 w-screen h-screen flex items-center justify-center"}>
        <button className="bg-white p-2 px-4 border-r-2 rounded-lg" onClick={() => signIn('google')}>Login with Google</button>
      </div>
    )
  }

  return (<Layout>
  </Layout>)
}
