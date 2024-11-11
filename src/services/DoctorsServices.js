const formatDate = (date) => {
  console.log(date);
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}

export const fetchProfessionals = async () => {
  const USERS_API = process.env.NEXT_PUBLIC_SHOW_PROFESSIONALS
  try {
    const data = await fetch(USERS_API, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      }
    })
    const { users: response } = await data.json()

    return response
  } catch (err) {
    console.log(err)
  }
}

export const fetchSpecialityById = async (usuario_id) => {
  const SPECIALITY_URL = process.env.NEXT_PUBLIC_SHOW_ESPECIALIDAD_BY_ID
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

    const response = await data.json()
    return response;
  } catch (err) {
    console.log(err)
  }
}

export const fetchSpecialities = async () => {
  const SPECIALITY_URL = process.env.NEXT_PUBLIC_SHOW_ESPECIALIDADES
  try {
    const data = await fetch(SPECIALITY_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
    })
    const { especialidad } = await data.json()
    return especialidad;
  } catch (err) {
    console.log(err)
  }
}

export const professionalsWithSpeciality = async (specialities, users) => {
  const especialidadMap = new Map(
    specialities.map((user) => [user.usuario_id, user.especialidad])
  );

  return users.map((user) => ({
    ...user,
    especialidad: especialidadMap.get(user.id) || null, 
  }));
}

export const fetchProfessionalById = async (id) => {
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
    const response = await data.json()
    return response
  } catch (err) {
    console.log(err)
  }
}

export const addProfessional = async (user) => {
  // const USERS_API = process.env.VITE_USERS_API + `/api/professionals`
  const USERS_API = process.env.NEXT_PUBLIC_CREATE_PROFESSIONAL
  const body = {
    "nombre": user.name,
    "apellido": user.lastName,
    "rut": "16332702-3",
    "fechaNacimiento": "1990-03-03",
    "genero": user.genero.label,
    "email": user.email,
    "telefono": 987654321,
    "contrasena": user.password,
    "especialidad": user.speciality.value,
    "tipo_usuario": 'profesional',
    "status": 'activo',
    "campus": user.campus,
    "carrera": user.speciality.label,
    "anoIngresoCarrera": "2020-03-03",
    "jornada": "laboral",
    "direccion": "random",
    "region": "santiago",
    "comuna": "santiago",
  }
  console.log('body', body);

  try {
    const data = await fetch(USERS_API, {
      method: "POST",
      cors: "no-cors",
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify(body)
    })

    // console.log('data', data)
    // const response = await data.json()
    // console.log('RESPONSE', response)
    // if (!data.ok && response?.message.includes('Duplicate entry')) return { err: 'Usuario duplicado' }

    return data
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

