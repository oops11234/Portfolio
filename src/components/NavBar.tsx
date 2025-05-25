import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NavLinkItem from "./NavLinkItem";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const lightBarOn = ["/", "/LiveStream", "/CryptoMarket"];
  const isLightBarOn = lightBarOn.includes(location.pathname);

  return (
    <nav
      className={`bg-black p-4 flex items-center justify-between fixed top-0 left-0 w-full h-[90px] z-40 text-white ${
        isLightBarOn ? "shadow-lg shadow-cyan-500/30" : ""
      }`}
    >
      {/* Logo */}
      <Link to="/" className="text-4xl font-bold text-neon">
        Cyber Park
      </Link>

      {/* 漢堡按鈕 */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-cyan-300 text-3xl focus:outline-none"
      >
        ☰
      </button>

      {/* 導覽列表 - Desktop */}
      <div className="hidden md:flex items-center space-x-6">
        <NavLinkItem to="/">Home</NavLinkItem>
        <NavLinkItem to="/LiveStream">LiveStream</NavLinkItem>
        <NavLinkItem to="/CryptoMarket">CryptoMarket</NavLinkItem>
        <NavLinkItem to="/BlackjackTable">BlackjackTable</NavLinkItem>
        <NavLinkItem to="/CyberCity">CyberCity</NavLinkItem>
      </div>

      {/* 導覽列表 - Mobile 展開 */}
      {menuOpen && (
        <div className="absolute top-[90px] left-0 w-full bg-black z-30 md:hidden flex flex-col shadow-lg shadow-cyan-500/30 border-glow-top">
          <NavLinkItem to="/">Home</NavLinkItem>
          <NavLinkItem to="/LiveStream">LiveStream</NavLinkItem>
          <NavLinkItem to="/CryptoMarket">CryptoMarket</NavLinkItem>
          <NavLinkItem to="/BlackjackTable">BlackjackTable</NavLinkItem>
          <NavLinkItem to="/NeonScene">NeonScene</NavLinkItem>
        </div>
      )}
    </nav>
  );
}