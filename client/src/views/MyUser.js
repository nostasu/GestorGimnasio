//Aqui vamos a tener los datos del usuario, las reservas.. inscribirse usuario...
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { Link, Outlet } from 'react-router-dom'
import NavbarPpal from "../components/NavbarPpal"
import Show1Training from '../components/Show1Training'
import myAvatar from "../myAvatar.png"


const MyUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                let response = await axios({
                    url: `/usuarios/myUser`,
                    headers: {
                        Authorization: localStorage.getItem("jwt_token")
                    }
                });
                console.log(response.data);
                setUser(response.data.user);
            } catch (err) {
                console.log(err.response);
            }
        }
        getData()
    }, [])


    const loading = () => {
        return ("Loading..");
    }

    const pintarPantalla = () => {
        let primeraClase = user.reservas.sort((a, b) => {
            return new Date(a.fechaClase).getTime() -
                new Date(b.fechaClase).getTime()
        });

        let existenClases = false;
        if (primeraClase.length !== 0) {
            existenClases = true;
        }

        return (
            <>
                <div className="containerPpal myUser">
                    <div className="datosPersonales d-flex justify-content-around ">
                        {user.foto ? user.foto : <img src={myAvatar} className="fotoAvatar" alt="avatar" />}
                        Bienvenido!<br />
                        {user.nombre} <br />
                        {user.apellidos}
                        <div className="editarModificar d-flex flex-column align-content-between">
                            <Link to="/ActualizarUsuario" className="mb-3"><i className="bi bi-pen-fill"> Editar </i></Link>
                            <Link to="/BorrarUsuario" state={{ from: 'usuario' }}><i className="bi bi-trash"> Borrar</i></Link>
                        </div>
                    </div>

                    <div className="container mt-3">
                        <h3><Link to={`/TodasClases/${user.gimnasio}/${user._id}`} state={{ from: 'usuario' }}> <i className="bi bi-alarm"></i>Inscribirse a una clase </Link></h3>
                        Proxima Reserva
                        <div className="row mt-1 justify-content-center">
                            {existenClases ? <Show1Training reservaId={`${primeraClase[0].clase}`} /> :
                                <Alert variant="danger" className="mt-3">
                                    Todavia no tienes reservas! Realiza una!
                                </Alert>}



                        </div>
                    </div>
                </div >
                <div>
                    <Outlet />
                </div >
                <NavbarPpal user={user} />
            </>
        )
    }

    return (
        <>
            {user ? pintarPantalla() : loading()}
        </>

    )
}
export default MyUser
