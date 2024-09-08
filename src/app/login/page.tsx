'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import useAuth from '@/hooks/getAuth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email or password.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
      setErrorMessage("Invalid email or password.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  if (user) {
    router.push("/");
    return;
  }

  return (
    <main>
      <div className="mx-auto py-6 md:max-w-xl px-16 text-center">
        <p className="text-5xl font-semibold">Log in</p>
        <div className='flex flex-col p-4 w-full mb-2' onSubmit={handleLogin}>
          <div className="relative my-2">
            <input type="email" id="filled_success" onChange={(e) => setEmail(e.target.value)} aria-describedby="filled_success_help" className="block rounded-lg px-3 pb-3 pt-5 w-full text-md text-gray-900 border-0 border-2 border-gray-300 outline-none peer" placeholder=" " />
            <label htmlFor="filled_success" className="absolute text-md text-gray-700 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Email</label>
          </div>
          <div className="bg-white rounded-lg w-full text-md text-gray-900 border-0 border-2 border-gray-300 outline-none flex relative my-2">
            <input type={showPassword ? "text" : "password"} id="filled_success_1" onChange={(e) => setPassword(e.target.value)} aria-describedby="filled_success_help" className="block rounded-lg px-3 pb-3 pt-5 w-full text-md text-gray-900 outline-none peer" placeholder=" " />
            <label htmlFor="filled_success_1" className="absolute text-md text-gray-700 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Password</label>
            <Image src={showPassword ? "/visibility_off.svg" : "/visibility.svg"} alt="visiblity" onClick={() => setShowPassword(!showPassword)} width={30} height={30} className="my-auto mr-2 rounded-full" />
          </div>
          { errorMessage == "" ? null :
            <p className="mx-auto max-w-sm flex justify-center items-center rounded-lg text-center py-1.5 px-4 bg-red-500 text-white text-xs sm:text-md">
              <Image src="/warning.svg" alt="warning" className="mr-2" width={20} height={20}/>
              {errorMessage}
            </p>
          }
          <button onClick={handleLogin} className="mt-4 mx-auto text-white w-48 py-1.5 rounded-lg bg-green-600 font-semibold text-xl hover:bg-green-700 transition" type="submit">Log in</button>
        </div>
        <button className="mx-auto mb-6 flex items-center border-[1px] border-gray-400 p-3 rounded-lg" onClick={handleGoogleLogin}>
          Continue with Google
          <Image className="ml-2" src="/google.png" alt="google" width={20} height={20}/>
        </button>
        <Link className="text-blue-400 underline" href="/signup">Create an account</Link>
      </div>
    </main>
  );
}