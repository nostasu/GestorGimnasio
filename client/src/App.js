import { Routes, Route } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePpal from "./views/HomePpal"
import NuestrosCentros from "./views/NuestrosCentros"
import SignUpUser from "./views/SignupUser";
import SignUpGym from "./views/SignupGym"
import LoginGym from "./components/LoginGym";

function App() {
  return (
    <header className="App-header">
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePpal />} />
          <Route path="/NuestrosCentros" element={<NuestrosCentros />} />
          <Route path="/SignUpUser" element={<SignUpUser />} />
          <Route path="/SignUpGym" element={<SignUpGym />} />
          <Route path="/LoginGym" element={<LoginGym />} />
        </Routes>


      </div >
    </header>
  );
}

export default App;
