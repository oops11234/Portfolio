import { Link,useLocation  } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isIndexPage = location.pathname === "/";
  return (
    <nav
      className={`bg-black p-4 flex justify-between items-center fixed h-[90px] top-0 left-0 w-full text-white z-40 ${
        isIndexPage ? "shadow-lg shadow-cyan-500/30" : ""
      }`}
    >
      <h1 className="text-4xl font-bold text-neon">NeonWeb</h1>
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="px-4 py-2 text-cyan-300 text-neon-soft hover:text-white hover:underline transition"
        >
          Home
        </Link>
        <Link
          to="/blackjackTable"
          className="px-4 py-2 text-cyan-300 text-neon-soft hover:text-white hover:underline transition"
        >
          BlackjackTable
        </Link>
      </div>
    </nav>
  );
}