import React, { useState, useEffect } from 'react';

function ElementosLista({ elementos }) {
  const [semanaActual, setSemanaActual] = useState(0);
  const elementosPorSemana = 5;
  const cantidadSemanas = Math.ceil(elementos.length / elementosPorSemana);

  const irPagina = (incremento) => {
    const nuevaPagina = semanaActual + incremento;
    if (nuevaPagina >= 0 && nuevaPagina < cantidadSemanas) {
      setSemanaActual(nuevaPagina);
    }
  };

  const inicio = semanaActual * elementosPorSemana;
  const fin = Math.min(inicio + elementosPorSemana, elementos.length);
  const elementosMostrados = elementos.slice(inicio, fin);

  return (
    <div>
      <button onClick={() => irPagina(-1)}>Anterior</button>
      {elementosMostrados.map((elemento, index) => (
        <div key={index}>{elemento}</div>
      ))}
      <button onClick={() => irPagina(1)}>Siguiente</button>
    </div>
  );
}

export default ElementosLista;