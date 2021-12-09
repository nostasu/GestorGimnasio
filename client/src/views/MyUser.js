//Aqui vamos a tener los datos del usuario, las reservas.. inscribirse usuario...
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavbarPpal from "../components/NavbarPpal"


const MyUser = () => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                let response = await axios({
                    url: `http://localhost:5000/api/usuarios/myUser`,
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
        return (
            <>
                <div>

                    <div className="container containerUp">
                        <p> foto </p>
                        <p> nombre</p>
                        <p> Emoticono Borrar </p>
                        <p> Emoticono Boli</p>
                    </div>

                    <div className="container">
                        <p> <Link to="/CrearClase"> Mis Reservas (Historial)</Link></p>
                        <p> <Link to={`/TodasClases/${user.gimnasio}`}> Inscribirse a una clase </Link></p>
                        <p> Proximas reservas</p>
                        <p> <Link to="/MostrarTodasCuotas" >Mostrar todas Cuotas </Link> </p>

                    </div>
                </div>
                <div>
                    <NavbarPpal />
                </div>

            </>
        )
    }


    return (
        <>
            {user ? pintarPantalla() : loading()}
        </>
    )
}

export default MyUser;
