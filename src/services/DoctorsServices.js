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
    const { especialidades } = await data.json()
    return especialidades;
  } catch (err) {
    console.log(err)
  }
}

export const professionalsWithSpeciality = async (specialities, users) => {
  const especialidadMap = new Map(
    specialities.map((user) => [user.usuario_id, user.especialidad])
  );

  return users.map((user) => (
    {
      ...user,
      especialidad: especialidadMap.get(user.id) || 'No informado',
    })
  );
}

export const fetchProfessionalById = async (id) => {
  const USERS_API = process.env.NEXT_PUBLIC_SHOW_PROFESSIONALS_BY_ID
  try {
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
    const response = await data.json()
    return response
  } catch (err) {
    console.log(err)
  }
}

export const addProfessional = async (user) => {
  const USERS_API = process.env.NEXT_PUBLIC_CREATE_PROFESSIONAL
  const body = {
    "apellido": user.lastName,
    "nombre": user.name,
    "rut": "no informado",
    "fechaNacimiento": "1990-03-03",
    "genero": user.genero.label,
    "email": user.email,
    "telefono": "no informado",
    "contrasena": user.password,
    "especialidad": user.speciality.value,
    "tipo_usuario": 'profesional',
    "status": user.status,
    "campus": user.campus,
    "carrera": "no informada",
    "anoIngresoCarrera": "2020-03-03",
    "jornada": "no informado",
    "direccion": "no informado",
    "region": "no informado",
    "comuna": "no informado",
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
    const response = data.json()
    return response
  } catch (err) {
    console.log('ERROR', err)
  }
}

export const addEspecialidad = async (data)=> {
  const URL = process.env.NEXT_PUBLIC_ADD_ESPECIALIDAD
  const body = {
    id_user: data.id,
    id_especialidad: data.especialidad_id
  }

  try {
    const data = await fetch(URL, {
      method: "POST",
      cors: "no-cors",
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify(body)
    })
    const response = data.json()
    return response
  } catch (err) {
    console.log('ERROR', err)
  }
}

export const updateDoctor = async (user, id) => {
  const USERS_API = process.env.NEXT_PUBLIC_EDIT_USER
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
    "status": user.status,
    "id_emergencia": 0,

  }

  try {
    // const data = await fetch(USERS_API, {
    //   method: "POST",
    //   headers: {
    //     'content-type': 'application/json',
    //     'access-control-allow-origin': '*',
    //     'ngrok-skip-browser-warning': 'any'
    //   },
    //   body: JSON.stringify(body)
    // })

    return data
  } catch (err) {
    console.log(err)
  }
}



export const updateProfesional = async (user) => {
  const USERS_API = process.env.NEXT_PUBLIC_EDIT_PROFESIONAL
  const body = {
    ...user
  }
  console.log('user', user)
  try {
    const data = await fetch(USERS_API, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(user)
    })

    return data.json()
  } catch (error) {
    return error
  }
}

export const changePassword = async (user) => {
  const USERS_API = process.env.NEXT_PUBLIC_CHANGE_PASSWORD
  const body = {
    ...user,
  }
  console.log('body', body)
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
    return data.json()
  } catch (error) {
    return error
  }
}


export const changeStatus = async (id, status) => {
  const USERS_API = process.env.NEXT_PUBLIC_EDIT_USER
  try {
    const data = await fetch(USERS_API, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
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




// {
//   "apellido": "profesional",
//   "campus": "ambas",
//   "email": "profesional@profesional.com",
//   "fecha_nacimiento": "Mon, 20 Feb 1995 00:00:00 GMT",
//   "genero": "personalizado",
//   "id": 6,
//   "mustChangePassword": 0,
//   "nombre": "profesional",
//   "status": "activo",
//   "telefono": "123456789",
//   "tipo_usuario": "profesional",
//   "name": "profesional",
//   "lastName": "profesional",
//   "mobile": "123456789",
//   "dateOfBirth": "Mon, 20 Feb 1995 00:00:00 GMT",
//   "gender": "personalizado",
//   "speciality": "Psicopedagogía"
// }