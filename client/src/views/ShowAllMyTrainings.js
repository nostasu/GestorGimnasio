// import React, { useState, createContext, useContext } from "react";
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

const ShowAllMyTrainings = () => {

    return (
        <Tabs defaultActiveKey="proximasReservas" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="proximasReservas" title="Proximas Reservas">
                Proximas Reservas
            </Tab>
            <Tab eventKey="EntrenamientosPasados" title="Historial Entrenamientos">
                Reservas pasadas
            </Tab>
        </Tabs>
    )
}

export default ShowAllMyTrainings
