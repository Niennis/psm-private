import React, { useState } from 'react';

function App() {
  const data = [
    { id: 1, titulo: 'Título 1', contenido: 'Contenido 1' },
    { id: 2, titulo: 'Título 2', contenido: 'Contenido 2' },
    { id: 3, titulo: 'Título 3', contenido: 'Contenido 3' },
  ];

  return (
    <div>
      {data.map((item) => (
        <ContenedorConTitulo key={item.id} titulo={item.titulo} contenido={item.contenido} />
      ))}
    </div>
  );
}

function ContenedorConTitulo({ titulo, contenido }) {
  const [mostrarContenido, setMostrarContenido] = useState(false);

  return (
    <div
      style={{ position: 'relative', width: '200px', height: '100px', margin: '10px', cursor: 'pointer' }}
      onMouseEnter={() => setMostrarContenido(true)}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transition: 'opacity 0.5s',
          opacity: mostrarContenido ? 0 : 1,
          pointerEvents: mostrarContenido ? 'none' : 'auto',
          border: '1px solid black',
          padding: '10px',
        }}
      >
        <h2>{titulo}</h2>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transition: 'opacity 0.5s',
          opacity: mostrarContenido ? 1 : 0,
          pointerEvents: mostrarContenido ? 'auto' : 'none',
          border: '1px solid black',
          padding: '10px',
        }}
      >
        <p>{contenido}</p>
      </div>
    </div>
  );
}

export default App;
