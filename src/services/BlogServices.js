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
  } catch (error) {
    console.log('Error:', error)
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
  } catch (error) {
    console.log('Error:', error)
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
    if (!data.ok && response.message.includes('Duplicate entry')) return { err: 'Usuario duplicado' }

    return response
  } catch (error) {
    console.log('Error:', error)
  }
}

export const updateBlog = async (blog, id) => {
  const BLOGS_API = `${process.env.NEXT_PUBLIC_BLOGS}/edit_blog`
  // const { title, author_name, category, subcategory, status_blog, content, image } = blog;

  // const body = {
  //   title, author_name, category, subcategory, status_blog, content, image
  // }

  try {
    const data = await fetch(BLOGS_API, {
      method: "PUT",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(blog)
    })

    return data
  } catch (error) {
    console.log('Error:', error)
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
  } catch (error) {
    console.log('Error:', error)
  }
}

export const uploadFile = async (body) => {
  const URL = `${process.env.NEXT_PUBLIC_BLOGS}/upload`;


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

export const createDownload = async (download) => {
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
  } catch (error) {
    console.log('Error:', error)
  }
}
