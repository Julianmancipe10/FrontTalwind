import React from 'react';
import { Header } from '../../Layouts/Header/Header';
import cronogramaImg from '../../assets/images/cronograma.png';
import rolImg from '../../assets/images/selecciona_tu_rol.png';
import camposImg from '../../assets/images/completa_los_campos.png';

import './Horario.css';

const Horario = () => {
  return (
    <div className="horario-container">
      <Header />

      <main className="horario-main">
        <h1 className="titulo">PARA VER TU HORARIO ES MUY SENCILLO<br />SOLO TIENES QUE SEGUIR LOS SIGUIENTES PASOS</h1>

        <section className="paso">
          <h2>Paso 1. entra al siguiente link <a href="https://cct.sisge.space/" target="_blank" rel="noreferrer"> <span className="verde">cct.sisge.space</span> </a> (sistema de gestor educativo)</h2>
        </section>

        <section className="paso">
          <h2>Paso 2. selecciona <span className="verde">Cronograma de formación</span></h2>
          <div className="imagen-container">
            <img src={cronogramaImg} alt="Pantalla de bienvenida SISGE" className="paso-imagen" />
          </div>
        </section>

        <section className="paso">
         
          <img src={rolImg} alt="Seleccionar ROL" />
          <h2>Paso 3. selecciona tu <span className="verde">ROL</span></h2>
        </section>

        <section className="paso">
          <h2>Paso 4. completa los <span className="verde">campos</span> correctamente y ¡listo! podrás ver tu horario de clase</h2>
          <img src={camposImg} alt="Formulario Cronograma" />
        </section>
      </main>
    </div>
  );
};

export default Horario;
