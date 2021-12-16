//Aqui vamos a tener los datos del usuario, las reservas.. inscribirse usuario...
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CardClasses from './CardClasses';

const Show1Training = ({ reservaId }) => {

    const [reserva, setReserva] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                let response = await axios({
                    url: `/clases/find/${reservaId}`,
                });
                console.log(response.data);
                setReserva(response.data.clase);

            } catch (err) {
                console.log(err.response);
            }
        }
        getData()
    }, [reservaId])

    const loading = () => {
        return ("Loading..");
    }

    const pintarPantalla = () => {
        return (
            <>
                <CardClasses clase={reserva} />
            </>
        )
    }

    return (
        <>
            {reserva ? pintarPantalla() : loading()}
        </>
    )
}

export default Show1Training;
