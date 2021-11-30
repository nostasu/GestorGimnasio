import { useEffect, useState } from "react";
import axios from "axios";
import Cards from "./Cards"

const ShowGyms = () => {
    const [gym, setGyms] = useState([]);
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios("http://localhost:5000/api/gimnasios/allGyms");
                console.log(response.data.gyms);
                setGyms(response.data.gyms);
            } catch (err) {
                console.log(err);
            }
        };
        getData();
    }, []);

    return (
        <div>
            {gym.map((gimnasio, i) => {
                return (
                    <Cards key={i} gimnasio={gimnasio} />
                );
            })}
        </div>
    )
}


export default ShowGyms;