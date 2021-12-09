import { Link } from "react-router-dom";
import "./stylesComponents/header.css"

const Header = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid d-flex">
                <a className="navbar-brand logo" href="#">Gestor Reservas</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse r-12" id="navbarTogglerDemo02">
                    <ul className="navbar-nav ">
                        <li className="marginRight">
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/NuestrosCentros">Nuestros centros</Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Header;