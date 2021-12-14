
import { Link } from "react-router-dom";
import Figure from 'react-bootstrap/Figure'
import Button from 'react-bootstrap/Button';
import gestorReservas from '../gestorReservas.png'

const HomePpal = () => {

    return (
        <div className="homePpal">
            <div className="container containerPpal mt-3">
                <Figure className="figure d-flex justify-content-center flex-cloumn">
                    <Figure.Image
                        width={200}
                        src={gestorReservas}
                        className="figure-img img-fluid rounded" alt="Logo de la pagina" />
                    <Figure.Caption className="figure-caption align-bottom text-center ms-1"> Bienvenido al Gestor de Reservas! Accede como usuario
                        o como gimnasio para crear tus clases o reservarlas!</Figure.Caption>
                </Figure>

                <Link to="/SignUpUser">
                    <Button type="button" className="me-3 mb-3"> Signup User</Button>
                </Link>
                <Link to="/SignUpGym">
                    <Button type="button" className="ms-3 mb-3"> Signup Gym</Button>
                </Link>
                <p> Have already an account? </p>
                <p><Link to="/LoginGym">Login as a Gym!</Link> </p>
                <p> <Link to="/LoginUser">Login as a User!</Link></p>

            </div>
        </div >
    )
}

export default HomePpal;