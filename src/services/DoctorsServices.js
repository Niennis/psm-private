const formatDate = (date) => {
  console.log(date);
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}

export const fetchDoctors = async () => {
  const USERS_API = process.env.NEXT_PUBLIC_SHOW_PROFESSIONALS
  try {
    const data = await fetch(USERS_API, {
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        'ngrok-skip-browser-warning': 'any'
      }
    })
    return data.json()
  } catch (err) {
    console.log(err)
  }
}

export const fetchSpeciality = async (usuario_id) => {
  const SPECIALITY_URL = process.env.NEXT_PUBLIC_SHOW_ESPECIALIDADES
  try {
    const data = await fetch(SPECIALITY_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify({
        usuario_id
      })
    })
    return data.json()
  } catch (err) {
    console.log(err)
  }
}

export const fetchDoctor = async (id) => {
  const USERS_API = process.env.NEXT_PUBLIC_SHOW_PROFESSIONALS_BY_ID
  try {
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
    return data.json()
  } catch (err) {
    console.log(err)
  }
}

export const addDoctor = async (user) => {
  // const USERS_API = process.env.VITE_USERS_API + `/api/professionals`
  const USERS_API = process.env.NEXT_PUBLIC_CREATE_PROFESSIONAL
  const body = {
    "nombre": user.name,
    "apellido": user.lastName,
    "rut": "16332702-3",
    "fechaNacimiento": "14-02-1990",
    "genero": user.genero.label,
    "email": user.email,
    "telefono": 987654321,
    "contrasena": user.password,
    "especialidad": user.speciality.value,
    "tipo_usuario": 'profesional',
    "status": 'activo',
    "campus": 'Sede Centro',
    "carrera": user.speciality.label,
    "anoIngresoCarrera": "14-02-2024",
    "jornada": "laboral",
    "direccion": "random",
    "region": "santiago",
    "comuna": "santiago",
    "status": user.status,
    "especialidad": user.speciality.label,
  }

  console.log('body', body);
  try {
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

    console.log('STATUS', data.status, data.ok, data)
    const response = await data.json()
    console.log('response', response)
    if (!data.ok && response.message.includes('Duplicate entry')) return { err: 'Usuario duplicado' }

    return response
  } catch (err) {
    console.log('ERROR', err)
  }
}

export const updateDoctor = async (user, id) => {
  const USERS_API = process.env.NEXT_PUBLIC_USERS_API + `/api/professionals/${id}`
  const body = {
    "nombre": user.name,
    "apellido": user.lastName,
    "telefono": user.mobile,
    "email": user.email,
    "contrasena": user.password,
    "fecha_nacimiento": formatDate(user.dateOfBirth.$d),
    "genero": user.gender,
    "tipo_usuario": 'profesional',
    "especialidad": user.speciality.value,
    "status": user.status
  }

  try {
    const data = await fetch(USERS_API, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        'ngrok-skip-browser-warning': 'any'
      },
      body: JSON.stringify(body)
    })

    return data
  } catch (err) {
    console.log(err)
  }
}

export const changeStatus = async (id, status) => {
  const USERS_API = process.env.NEXT_PUBLIC_USERS_API + `/api/users/${id}`
  try {
    const data = await fetch(USERS_API, {
      method: "PUT",
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        'ngrok-skip-browser-warning': 'any'
      },
      body: JSON.stringify({
        "status": status
      })
    })
    return data
  } catch (err) {
    console.log(err)
  }
}

