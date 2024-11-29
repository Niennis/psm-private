const cleanRut = rut => {
  return typeof rut === 'string'
    ? rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase()
    : ''
}

export const formatRut = (rut) => {
  rut = cleanRut(rut)

  let result;
  result = rut.slice(-4, -1) + '-' + rut.substr(rut.length - 1)
  for (let i = 4; i < rut.length; i += 3) {
    result = rut.slice(-3 - i, -i) + '.' + result
  }
  return result
}


export const validarRut = rut => {
  rut = rut.replace(/\./g, '').replace(/-/g, '');

  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
    multiplo = (multiplo < 7) ? multiplo + 1 : 2;
  }

  const resto = suma % 11;
  let dvEsperado = 11 - resto;

  dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dvEsperado === dv;
}

const rutEjemplo = '12.345.678-5';
if (validarRut(rutEjemplo)) {
  console.log('RUT válido');
} else {
  console.log('RUT inválido');
}

export const formatDateToYYYYMMDD =(dateString) => {
  const date = new Date(dateString); 
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0'); 

  return `${year}-${month}-${day}`;
}