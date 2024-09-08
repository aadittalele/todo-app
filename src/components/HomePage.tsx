import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-center px-2">
      <p className="text-4xl font-bold mt-24 my-6">A Simple Todo App</p>
      <p className="text-2xl text-gray-500 mb-8">Made with Next.js, Tailwind, and Firebase</p>
      <Link className="text-white text-xl font-semibold rounded-xl p-3 bg-blue-500" href="/login">Log in</Link>
    </div>
  );
}