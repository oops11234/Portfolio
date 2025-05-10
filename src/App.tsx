import { Routes, Route, HashRouter } from "react-router-dom";
import Navbar from "./components/NavBar.tsx";
import BlackJack from "./pages/BlackJack.tsx";
import BlackjackTable from "./pages/BlackjackTable.tsx";
import Index from "./pages/Index.tsx";
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
          <Route path="/contract" element={<BlackJack />} />
          <Route path="/blackjackTable" element={<BlackjackTable />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
