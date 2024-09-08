'use client';
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import useAuth from "@/hooks/getAuth";
import Spinner from "./Spinner";
import Link from "next/link";

export default function Signout() {
  const { user, loading: loadingUser } = useAuth();

  return (<>
    { loadingUser ?
      <Spinner />
    :
      <>
        { user ? 
          <button onClick={() => signOut(auth)} className="py-2 px-4 rounded-xl bg-blue-500 transition hover:bg-blue-700">Sign out</button>
        :
          <Link href="/login" className="py-2 px-4 rounded-xl bg-blue-500 transition hover:bg-blue-700">Log in</Link>
        }
      </>
    }
  </>);
}