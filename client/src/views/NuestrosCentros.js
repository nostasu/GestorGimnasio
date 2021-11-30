
import ShowGyms from "../components/ShowGyms"
import { Link } from "react-router-dom";

const NuestrosCentros = () => {

    return (
        <div>
            <h1 className="app-header">Nuestros Centros</h1>
            <ShowGyms />
            <nav>
                <Link to="/"> Home </Link>
            </nav>
        </div>

    )
}

export default NuestrosCentros;