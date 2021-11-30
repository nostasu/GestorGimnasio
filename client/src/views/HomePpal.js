
import { Link } from "react-router-dom";
import Figure from 'react-bootstrap/Figure'
import Button from 'react-bootstrap/Button';
import FigureImage from 'react-bootstrap/FigureImage'
import FigureCaption from 'react-bootstrap/FigureCaption'
import gestorReservas from '../gestorReservas.png'


const HomePpal = () => {

    return (
        <div className="container">
            <h1> Gestor Reservas </h1>
            <Figure className="figure d-flex justify-content-center flex-cloumn">
                <FigureImage
                    width={200}
                    src={gestorReservas}
                    className="figure-img img-fluid rounded" alt="Logo de la pagina" />
                <FigureCaption className="figure-caption align-bottom">Welcome to Gestor Reservas!</FigureCaption>
            </Figure>
            <Link to="/SignUpUser">
                <Button type="button"> Signup User</Button>
            </Link>
            <Link to="/SignUpGym">
                <Button type="button"> Signup Gym</Button>
            </Link>
            <p> Have already an account? <Link to="/LoginGym">Login!</Link> </p>
            <nav>
                <Link to="/NuestrosCentros">Nuestros centros</Link>
            </nav>
        </div>
    )
}

export default HomePpal;