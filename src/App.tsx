import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar.tsx";
import BlackJack from "./pages/BlackJack.tsx";
import BlackjackTable from "./pages/BlackjackTable.tsx";
import './App.css'

function App() {

  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<div>這是首頁1</div>} />
        <Route path="/contract" element={<BlackJack />} />
        <Route path="/blackjackTable" element={<BlackjackTable />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
