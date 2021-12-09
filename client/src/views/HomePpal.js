
import { Link } from "react-router-dom";
import Figure from 'react-bootstrap/Figure'
import Button from 'react-bootstrap/Button';
import FigureImage from 'react-bootstrap/FigureImage'
import FigureCaption from 'react-bootstrap/FigureCaption'
import gestorReservas from '../gestorReservas.png'
// import ChipInput from "../components/ChipInput"


const HomePpal = () => {

    return (
        <div className="homePpal">
            <div className="container">
                <Figure className="figure d-flex justify-content-center flex-cloumn">
                    <FigureImage
                        width={200}
                        src={gestorReservas}
                        className="figure-img img-fluid rounded" alt="Logo de la pagina" />
                    <FigureCaption className="figure-caption align-bottom">Welcome to Gestor Reservas!</FigureCaption>
                </Figure>

                <Link to="/SignUpUser">
                    <Button type="button" className="me-3"> Signup User</Button>
                </Link>
                <Link to="/SignUpGym">
                    <Button type="button" className="ms-3" > Signup Gym</Button>
                </Link>
                <p> Have already an account? </p>
                <p><Link to="/LoginGym">Login as a Gym!</Link> </p>
                <p> <Link to="/LoginUser">Login as a User!</Link></p>

            </div>
        </div>
    )
}

export default HomePpal;