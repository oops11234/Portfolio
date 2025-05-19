import { Link, useLocation } from "react-router-dom";

const NavLinkItem = ({ to, children }: { to: string; children: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-4 py-2 text-cyan-300 text-neon-soft transition ${
        isActive ? "underline text-white" : "hover:text-white hover:underline"
      }`}
    >
      {children}
    </Link>
  );
};

export default NavLinkItem;