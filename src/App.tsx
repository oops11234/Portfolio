import { Routes, Route, HashRouter } from "react-router-dom";
import Navbar from "./components/NavBar.tsx";
import LiveStream from "./pages/LiveStream.tsx.tsx";
import BlackjackTable from "./pages/BlackjackTable.tsx";
import Index from "./pages/Index.tsx";
import CyberCity from './pages/CyberCity.tsx'
import CryptoMarket from "./pages/CryptoMarket.tsx";
import GaussianDrop from "./pages/GaussianDrop.tsx";
import Resume from "./pages/Resume.tsx";
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
          <Route path="/GaussianDrop" element={<GaussianDrop />} />
          <Route path="/Resume" element={<Resume />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
