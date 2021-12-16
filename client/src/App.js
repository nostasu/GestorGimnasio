import { Outlet } from "react-router-dom";
import './App.css';
import axios from "axios"
import Header from "./components/Header";
import { useEffect } from "react";


function App() {

  useEffect(() => {
    const getData = async () => {
      try {
        let response = await axios.put("http://localhost:5000/api/clases/");
        console.log(response.data);
      } catch (err) {
        console.log(err.response);
      }
    }
    getData()
  }, [])

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="containerPpal" >
        <Outlet />
      </div >
    </>
  );
}


export default App;
