import * as React from 'react';
import ReactDOM from 'react-dom';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import HomePpal from "./views/HomePpal"
import NuestrosCentros from "./views/NuestrosCentros"
import SignUpUser from "./views/SignupUser";
import LoginUser from "./components/LoginUser";
import SignUpGym from "./views/SignupGym";
import LoginGym from "./components/LoginGym";
import Mostrar1Gym from './components/Mostrar1Gym';
import ShowFees from './views/ShowFees';
import MyUser from './views/MyUser';
import MyGym from './views/MyGym';
import CreateFee from './views/CreateFee';
import CreateClass from "./views/CreateClass";
import AllClasses from "./views/AllClasses";
import AllFeesGym from "./views/AllFeesGym";
import NewTraining from "./views/NewTraining";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} >
        <Route index element={<HomePpal />} />
        <Route exact path="/NuestrosCentros" element={<NuestrosCentros />} />
        <Route path="/NuestrosCentros/:GymId" element={<Mostrar1Gym />} />
        <Route path="/SignUpUser" element={<SignUpUser />} />
        <Route path="/LoginUser" element={<LoginUser />} />
        <Route path="/SignUpGym" element={<SignUpGym />} />
        <Route path="/LoginGym" element={<LoginGym />} />
        <Route path="/MyGym" element={<MyGym />} />
        <Route path="/CrearCuota" element={<CreateFee />} />
        <Route path="/TodasClases/:id" element={<AllClasses />} />
        <Route path="/CrearClase" element={<CreateClass />} />
        <Route path="/MostrarTodasCuotas" element={<AllFeesGym />} />
        <Route path="/MostrarCuotas" element={<ShowFees />} />
        <Route path="/MyUser" element={<MyUser />} />
        <Route path="/Inscribirse" element={<NewTraining />} />

      </Route>
    </Routes>

  </BrowserRouter>,
  document.getElementById("root")
);


