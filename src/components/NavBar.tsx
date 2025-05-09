import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white p-4 flex justify-between items-center fixed h-[90px] top-0 left-0 w-full text-black z-50 shadow-md">
      <h1 className="text-xl font-bold">WebTech</h1>
      <div className="flex items-center space-x-4">
        <Link className="px-4 py-2 rounded-md text-black hover:underline transition-all hover:text-black visited:text-black no-underline"  to="/">Home</Link>
        <Link className="px-4 py-2 rounded-md text-black hover:underline transition"  to="/contract">BlackJack</Link>
        <Link className="px-4 py-2 rounded-md text-black hover:underline transition"  to="/blackjackTable">BlackjackTable</Link>
      </div>
    </nav>
  );
}