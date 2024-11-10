
export const fetchUsers = async () => {
  const USERS_API = process.env.NEXT_PUBLIC_SHOW_PATIENTS

  const data = await fetch(USERS_API, {
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'ngrok-skip-browser-warning': 'any'
    }
  })

  console.log('SHOW_PATIENTS', data)
  return data.json()
}

export const fetchUser = async (id) => {
  const USERS_API = process.env.NEXT_PUBLIC_SHOW_PATIENT_BY_ID
  const data = await fetch(USERS_API, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'ngrok-skip-browser-warning': 'any'
    },
    body: JSON.stringify({
      id
    })
  })

  console.log('SHOW_PATIENT_BY_ID', data)

  return data.json()
}


export const fetchUserMailAndPass = async (user) => {
  const USERS_API = process.env.NEXT_PUBLIC_USERS_VALIDATE_USER
  const data = await fetch(USERS_API, {
    method: "POST",
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'ngrok-skip-browser-warning': 'any'
    },
    body: JSON.stringify({
      email: user.email,
      contrasena: user.contrasena
    })
  })
  console.log('USERS_VALIDATE_USER', data);
  
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

export const updateUser = async (user, id) => {
  const USERS_API = process.env.NEXT_PUBLIC_USERS_API + `/api/users/${id}`
  const data = await fetch(USERS_API, {
    method: "PUT",
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'ngrok-skip-browser-warning': 'any'
    },
    body: JSON.stringify({
      "nombre": user.name,
      "apellido": user.lastName,
      "telefono": user.mobile,
      "email": user.email,
      "contrasena": user.password,
      "fecha_nacimiento": user.date,
      "genero": user.male === "on" ? 'masculino' : 'femenino' || 'otro',
      "tipo_usuario": user.tipo_usuario
    })
  })

  return data
}

export const deleteUser = async (id) => {
  const USERS_API = process.env.NEXT_PUBLIC_USERS_API + `/api/users/${id}`
  try {
    await fetch(USERS_API, {
      method: 'DELETE',
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

