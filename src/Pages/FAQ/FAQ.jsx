import React from "react";
import FAQChat from "../../components/FAQChat";
import { Header } from "../../Layouts/Header/Header";

const FAQ = () => {
  return (
    <div>
      <Header />
      <h1 style={{ textAlign: "center", margin: "1rem" }}>Asistente de Preguntas Frecuentes</h1>
      <FAQChat />
    </div>
  );
};

export default FAQ;