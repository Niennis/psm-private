const convertirFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  // Los meses en JavaScript son 0-indexados 
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
};

const formatDate = (date) => {
  const newDate = new Date(date);

  const formattedDate = newDate.toISOString().split("T")[0];
  return formattedDate;
}

export const fetchUsers = async () => {
  const USERS_API = process.env.NEXT_PUBLIC_SHOW_PATIENTS

  const data = await fetch(USERS_API, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    }
  })

  const response = await data.json()
  return response
}

export const fetchUserByEmail = async (email) => {
  const USERS_BY_EMAIL = process.env.NEXT_PUBLIC_USER_BY_EMAIL
  const body = {
    "email": email
  }
  const data = await fetch(USERS_BY_EMAIL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    },
    body: JSON.stringify(
      body
    )
  })
  return data.json()
}

export const fetchPatientsDespejeFalse = async () => {
  const USERS_BY_EMAIL = process.env.NEXT_PUBLIC_CON_DESPEJE

  const data = await fetch(USERS_BY_EMAIL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    },
  })
  return data.json()
}


export const fetchUser = async (id) => {
  const USERS_API = process.env.NEXT_PUBLIC_SHOW_PATIENT_BY_ID
  const data = await fetch(USERS_API, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    },
    body: JSON.stringify({
      id
    })
  })

  return data.json()
}


export const fetchUserMailAndPass = async (user) => {
  const USERS_API = process.env.NEXT_PUBLIC_USERS_VALIDATE_USER
  const data = await fetch(USERS_API, {
    method: "POST",
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    },
    body: JSON.stringify({
      email: user.email,
      contrasena: user.contrasena
    })
  })
  return data.json()
}

export const addUsers = async (user) => {
  console.log('USR', user);
  const body = {
    "nombre": user.name,
    "apellido": user.lastName,
    "rut": '16332702-3',
    "fechaNacimiento": "14-02-2024",
    "genero": user.gender === 'male' ? 'masculino' : user.gender === 'female' ? 'femenino' : 'otro',
    "email": user.email,
    "telefono": user.mobile,
    "carrera": user.career.label,
    "anoIngresoCarrera": "14-02-2024",
    "jornada": "laboral",
    "direccion": "esa misma",
    "region": "asdasd",
    "comuna": "asdasd",
    "status": "activo"
  }
  console.log('body', body);
  const USERS_API = process.env.NEXT_PUBLIC_CREATE_PATIENTS
  const data = await fetch(USERS_API, {
    method: "POST",
    cors: "no-cors",
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'ngrok-skip-browser-warning': 'any'
    },
    body: JSON.stringify(body)
  })

  // "rut":"16332702-3",
  // "fechaNacimiento":"16/02/1983",
  return data.json()
}

export const updateUser = async (user) => {
  const USERS_API = process.env.NEXT_PUBLIC_EDIT_USER

  const body = {
    ...user,
    // fecha_nacimiento: formatDate(user.fecha_nacimiento),
  }

  console.log('body', body)
  const data = await fetch(USERS_API, {
    method: "POST",
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    },
    body: JSON.stringify(body)
  })

  return data.json()
}

export const deleteUser = async (id) => {
  const USERS_API = process.env.NEXT_PUBLIC_USERS_API + `/api/users/${id}`
  try {
    await fetch(USERS_API, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        'ngrok-skip-browser-warning': 'any'
      }
    })
  } catch (err) {
    console.log(err)
  }
}

