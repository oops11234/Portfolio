import { Routes, Route, HashRouter } from "react-router-dom";
import Navbar from "./components/NavBar.tsx";
import LiveStream from "./pages/LiveStream.tsx.tsx";
import BlackjackTable from "./pages/BlackjackTable.tsx";
import Index from "./pages/Index.tsx";
import CyberCity from './pages/CyberCity.tsx'
import CryptoMarket from "./pages/CryptoMarket.tsx";
import LoadingScreen from "./components/LoadingScreen.tsx";
import './App.css'

function App() {

  return (
    <>
      <LoadingScreen />
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/LiveStream" element={<LiveStream />} />
          <Route path="/CryptoMarket" element={<CryptoMarket />} />
          <Route path="/BlackjackTable" element={<BlackjackTable />} />
          <Route path="/CyberCity" element={<CyberCity />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
