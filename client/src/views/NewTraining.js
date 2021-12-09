// import React from 'react';
// import { useEffect, useState } from "react";
// import AllClasses from './AllClasses';
// import axios from "axios";
// import CardClasses from "../components/CardClasses"

// const NewTraining = () => {

//     const [clases, setClases] = useState([]); //Array de las clases de mi gimnasio


//     useEffect(() => {
//         const getData = async () => {
//             try {

//                 const response = await axios({
//                     url: "http://localhost:5000/api/usuarios/clasesGym",
//                     headers: {
//                         'Authorization': localStorage.getItem('jwt_token')
//                     }
//                 });
//                 setClases(response.data.user.gimnasio.clases);

//             } catch (err) {
//                 console.log(err);
//             }
//         };
//         getData();
//     }, []);



//     return (
//         <div>
//             {clases}

//         </div>
//     )
// }



// export default NewTraining
