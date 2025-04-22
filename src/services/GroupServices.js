//  --------- CREA GRUPOS ------------------
export const createGroup = async (input) => {
  const URL = `${process.env.NEXT_PUBLIC_SHOWPATIENTS}/grupo/create`
  const body = { nota: input.name }

  try {
    const data = await fetch(URL, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    const response = await data.json()
    return response

  } catch (error) {
    console.log('Error:', error)
  }
}

//  --------- MUESTRA USUARIOS --------------
export const usersGroups = async (input) => {
  const URL = `${process.env.NEXT_PUBLIC_SHOWPATIENTS}/grupo/users`
  const body = { uuid: input.uuid }

  try {
    const data = await fetch(URL, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    const response = await data.json()
    return response

  } catch (error) {
    console.log('Error:', error)

  }
}

//  --------- MUESTRA GRUPOS POR USUARIO ------------------
export const showGroups = async (input) => {
  const URL = `${process.env.NEXT_PUBLIC_SHOWPATIENTS}/grupo/showgrupos`

  const body = { id_user: input.id_user }
  try {
    const data = await fetch(URL, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    const response = await data.json()
    return response

  } catch (error) {
    console.log('Error:', error)

  }
}

//  --------- MUESTRA TODOS LOS GRUPOS ------------------
export const showAllGroups = async () => {
  const URL = `${process.env.NEXT_PUBLIC_SHOWPATIENTS}/grupo/showallgrupos`

  try {
    const data = await fetch(URL, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
    })
    const response = await data.json()
    return response

  } catch (error) {
    console.log('Error:', error)

  }
}

//  --------- AGREGA USUARIOS A UN GRUPO ----------------
export const addUserToGroup = async (input) => {
  const URL = `${process.env.NEXT_PUBLIC_SHOWPATIENTS}/grupo/adduser`
  const body = {
    uuid: input.uuid,
    id_user: input.id_user
  }
  try {
    const data = await fetch(URL, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    const response = await data.json()
    return response

  } catch (error) {
    console.log('Error:', error)

  }
}

//  --------- ELIMINA USUARIO DE UN GRUPO ------------------
export const deleteUserFromGroup = async (input) => {
  const URL = `${process.env.NEXT_PUBLIC_SHOWPATIENTS}/grupo/deleteuser`
  const body = {
    uuid: input.uuid,
    id_user: input.id_user
  }
  try {
    const data = await fetch(URL, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    const response = await data.json()
    return response

  } catch (error) {
    console.log('Error:', error)

  }
}

//  --------- ELIMINA UN GRUPO ------------------
export const deleteGroup = async (input) => {
  const URL = `${process.env.NEXT_PUBLIC_SHOWPATIENTS}/grupo/delete`
  const body = {
    uuid: input.uuid,
  }
  try {
    const data = await fetch(URL, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    const response = await data.json()
    return response

  } catch (error) {
    console.log('Error:', error)

  }
}
