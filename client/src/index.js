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
import Show1Gym from './components/Show1Gym';
import ShowFees from './views/ShowFees';
import MyUser from './views/MyUser';
import MyGym from './views/MyGym';
import CreateFee from './views/CreateFee';
import CreateClass from "./views/CreateClass";
import AllClasses from "./views/AllClasses";
import AllFeesGym from "./views/AllFeesGym";
import JoinClass from './views/JoinClass';
import ShowAllMyTrainings from './views/ShowAllMyTrainings';
import RequireAuth from './components/RequireAuth';
import PaginaBorrar from './views/PaginaBorrar';
import BorrarUsuario from './views/BorrarUsuario';
import DeleteTraining from './views/DeleteTraining';
import BorrarGym from "./views/BorrarGym"
import DeleteGymClass from './views/DeleteGymClass';
import UpdateGym from './views/UpdateGym';
import UpdateUser from './views/UpdateUser';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} >
        <Route index element={<HomePpal />} />
        <Route exact path="/NuestrosCentros" element={<NuestrosCentros />} />
        <Route path="/NuestrosCentros/:GymId" element={<Show1Gym />} />
        <Route path="/SignUpUser" element={<SignUpUser />} />
        <Route path="/LoginUser" element={<LoginUser />} />
        <Route path="/SignUpGym" element={<SignUpGym />} />
        <Route path="/LoginGym" element={<LoginGym />} />
        <Route element={<RequireAuth />}>
          <Route path="/MyGym" element={<MyGym />} />
          <Route path="/CrearCuota" element={<CreateFee />} />
          <Route path="/CrearClase" element={<CreateClass />} />
          <Route path="/MyUser" element={<MyUser />} />
          <Route path="/MostrarTodasCuotas" element={<AllFeesGym />} />
          <Route path="/MostrarCuotas/:id" element={<ShowFees />} />
          <Route exact path="/ApuntarseClase/:idClase" element={<JoinClass />} />
          <Route path="/TodosMisEntrenamientos" element={<ShowAllMyTrainings />} />
          <Route path="/BorrarUsuario" element={<PaginaBorrar />} />
          <Route path="/BorrarDefinitivamenteUsuario" element={<BorrarUsuario />} />
          <Route path="/BorrarDefinitamenteGimnasio" element={<BorrarGym />} />
          <Route path="/BorrarClase/:claseId" element={<DeleteTraining />} />
          <Route path="/ActualizarGimnasio" element={<UpdateGym />} />
          <Route path="/ActualizarUsuario" element={<UpdateUser />} />
          <Route exact path="/TodasClases/:id/:idUser" element={<AllClasses />} />
          <Route path="/BorrarClaseGym/:claseId" element={<DeleteGymClass />} />
        </Route>
      </Route>
    </Routes>

  </BrowserRouter >,
  document.getElementById("root")
);


