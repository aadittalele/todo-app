import Link from "next/link";
import Signout from "./Signout";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-5 px-16 text-white bg-blue-600">
      <Link href="/" className="text-2xl font-semibold">Todos</Link>
      <Signout />
    </nav>
  );
}