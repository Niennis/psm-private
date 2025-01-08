export const fetchBlogs = async () => {
  const BLOGS_API = process.env.NEXT_PUBLIC_SHOW_BLOGLIST
  try {
    const data = await fetch(BLOGS_API, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      }
    })
    const { blogs } = await data.json()
    return blogs
  } catch (err) {
    console.log(err)
  }
}

export const fetchBlog = async (id) => {
  const BLOGS_API = process.env.NEXT_PUBLIC_SHOW_BLOG_BY_ID

  const body = {
    id: id
  }
  try {
    const data = await fetch(BLOGS_API, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    return data.json()
  } catch (err) {
    console.log(err)
  }
}

export const createBlog = async (blog) => {
  const BLOGS_API = `${process.env.NEXT_PUBLIC_BLOGS}/add_blog`;
  const { blog_titulo, blog_bajada, blog_imagen, blog_texto, blog_destacado } = blog;

  const body = {
    titulo: blog_titulo,
    bajada: blog_bajada,
    texto: blog_texto,
    imagen: blog_imagen,
    video: '',
    destacado: blog_destacado
  }

  console.log('BODY', blog)
  try {
    const data = await fetch(BLOGS_API, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(blog)
    })

    const response = await data.json()
    // debe responder la id de blog
    console.log('add blog response', response)
    if (!data.ok && response.message.includes('Duplicate entry')) return { err: 'Usuario duplicado' }

    return response
  } catch (err) {
    console.log('ERROR', err)
  }
}

export const updateBlog = async (blog, id) => {
  const BLOGS_API = process.env.NEXT_PUBLIC_EDIT_BLOG
  const { title, author_name, category, subcategory, status_blog, content, image } = blog;

  const body = {
    title, author_name, category, subcategory, status_blog, content, image
  }

  try {
    const data = await fetch(BLOGS_API, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    return data
  } catch (err) {
    console.log(err)
  }
}

export const changeStatus = async (id, status) => {
  const BLOGS_API = process.env.NEXT_PUBLIC_BLOG_API + `/api/blogs/${id}`
  try {
    const data = await fetch(BLOGS_API, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ status })
    })
    return data
  } catch (err) {
    console.log(err)
  }
}

export const uploadFile = async (body) => {
  const URL = `${process.env.NEXT_PUBLIC_BLOGS}/upload`;

  console.log('UPLOADFILE BODY', body)

  try {
    const data = await fetch(URL, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const response = await data.json()
    console.log('RESPONSE', response)
    return response

  } catch (err) {
    console.log(err)
  }
}

export const createDownload = async (download) => {
  console.log('download', download)
  const BLOGS_API = `${process.env.NEXT_PUBLIC_BLOGS}/add_descarga`;
  const { blog_id, blog_bajada, blog_imagen, blog_texto, blog_destacado } = download;

  const body = {
    blog_id: blog_id,
    bajada: blog_bajada,
    texto: blog_texto,
    url: blog_imagen,
  }

  try {
    const data = await fetch(BLOGS_API, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(download)
    })

    const response = await data.json()

    return response
  } catch (err) {
    console.log('ERROR', err)
  }
}
