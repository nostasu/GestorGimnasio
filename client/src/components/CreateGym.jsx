
import axios from "axios";
import FormData from 'form-data';

const CreateGym = async (gimnasio) => {

    try {
        const formData = new FormData();

        formData.append("nombreCentro", gimnasio.nombreCentro);
        formData.append("password", gimnasio.password);
        formData.append("direccion", gimnasio.direccion);
        formData.append("logo", gimnasio.logo);
        //formData.append("entrenadores", gimnasio.entrenadores);

        console.log(`formData: ${formData}`);

        const response = await axios({
            method: 'post',
            url: "http://localhost:5000/api/authGym/signup",
            headers: { "Content-Type": "multipart/form-data" },
            data: formData
        })

        console.log(response);

    } catch (err) {
        console.log(err);
    }
}

export default CreateGym;