'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';

import FeatherIcon from "feather-icons-react";
import {
  blogimg1, blogimg10, blogimg11, blogimg12, blogimg2, blogimg3, blogimg4, blogimg5,
  blogimg6, blogimg7, blogimg8, blogimg9,
} from '@/components/imagepath'

import { fetchBlogs } from '@/services/BlogServices';

import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";

const cacheHandler = new CacheHandler();

const truncarPalabras = (texto, num) => {
  const aux = texto.split(' ');

  if (aux.length > num) {
    return aux.slice(0, num).join(' ') + '...';
  } else {
    return texto;
  }
}

const extractTextFromHTML = (htmlString) => {
  // Crear un contenedor temporal para procesar el HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Seleccionar solo las etiquetas permitidas (p, h1, h2, etc.)
  const allowedTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  let extractedText = '';

  allowedTags.forEach(tag => {
    const elements = doc.querySelectorAll(tag);
    elements.forEach(element => {
      extractedText += element.textContent.trim() + '\n'; // Agregar texto con un salto de línea
    });
  });

  return extractedText.trim(); // Eliminar espacios en blanco al inicio y al final
}

const normalizarTexto = (texto) => {
  // Expresiones regulares dinámicas para base y key
  const baseRegex = new RegExp(`(${process.env.NEXT_PUBLIC_BASE_IMG})`, "i");
  const removeInterrogationMark = process.env.NEXT_PUBLIC_KEY_IMG.split('?')[1]
  
  const keyRegex = new RegExp(removeInterrogationMark, "i");

  // Expresión regular para la URL (nombre de archivo de imagen con extensión)
  const urlRegex = /(\b\w+\.(jpg|png|gif|jpeg|webp)\b)/i;

  // Extraer las partes
  const baseMatch = texto.match(baseRegex);
  const urlMatch = texto.match(urlRegex);
  const keyMatch = texto.match(keyRegex);

  // Verificar que cada parte esté presente
  if (!baseMatch || !urlMatch || !keyMatch) {
    throw new Error("El texto no contiene base, url o key válidos.");
  }

  // Obtener los valores únicos (en caso de que haya duplicados)
  const base = baseMatch[1];
  const url = urlMatch[1];
  const key = keyMatch[1];

  // Reconstruir el texto en el orden correcto
  return `${base} ${url} ${key}`;
}
const prepareImg = (src) => {
  const match_base = src.match(new RegExp(process.env.NEXT_PUBLIC_BASE_IMG)) || [];
  const removeInterrogationMark = process.env.NEXT_PUBLIC_KEY_IMG.split('?')[1]

  const match_key = src.match(new RegExp(removeInterrogationMark)) || []

  if (match_base.length > 1 || match_key.length > 1) {
    normalizarTexto(src)
  } else if (src.includes(process.env.NEXT_PUBLIC_BASE_IMG) && src.includes('https://reposaludmental.blob.core.windows.net/test/') && !src.includes(process.env.NEXT_PUBLIC_KEY_IMG)) {

    return `/api/file-proxy?filePath=${src}`
  } else if (src.includes(process.env.NEXT_PUBLIC_BASE_IMG) && src.includes(process.env.NEXT_PUBLIC_KEY_IMG)) {
    const removeKey = src.split('?')[0]
    return `/api/file-proxy?filePath=${removeKey}`
  } else if (src.includes(process.env.NEXT_PUBLIC_BASE_IMG) && !src.includes(process.env.NEXT_PUBLIC_KEY_IMG)) {

    return `/api/file-proxy?filePath=${src}`
  } else if (src.includes(process.env.NEXT_PUBLIC_KEY_IMG) && !src.includes(process.env.NEXT_PUBLIC_BASE_IMG)) {

    return `/api/file-proxy?filePath=${process.env.NEXT_PUBLIC_BASE_IMG}${src}`
  } else if (!src.includes(process.env.NEXT_PUBLIC_BASE_IMG) && !src.includes(process.env.NEXT_PUBLIC_KEY_IMG)) {

    return `/api/file-proxy?filePath=${process.env.NEXT_PUBLIC_BASE_IMG}${src}`
  }
}

const BlogView = () => {
  const ROL = ["administrador"]
  const { data: session } = useSession()
  const router = useRouter();
  const { setProps } = useSidebar();
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    setProps({
      id: "menu-item11",
      id1: "menu-items11",
      activeClassName: "blog-grid",
    });
  }, [setProps]);

  const data = async () => {
    try {
      const response = await fetchBlogs()
      const result = response.reduce((acc, curr) => {
        // Verificar si el blog ya está agregado
        const existingBlog = acc.find(item => item.blog_id === curr.blog_id);

        if (existingBlog) {
          // Si ya existe, agregar el objeto de descarga al array "descargas"
          existingBlog.descargas.push({
            descarga_bajada: curr.descarga_bajada,
            descarga_titulo: curr.descarga_titulo,
            descarga_url: curr.descarga_url
          });
        } else {
          // Si no existe, agregar un nuevo blog con el array "descargas"
          acc.push({
            blog_id: curr.blog_id,
            blog_titulo: curr.blog_titulo,
            blog_bajada: curr.blog_bajada,
            blog_texto: curr.blog_texto,
            blog_imagen: curr.blog_imagen,
            blog_video: curr.blog_video,
            descargas: [
              {
                descarga_bajada: curr.descarga_bajada,
                descarga_titulo: curr.descarga_titulo,
                descarga_url: curr.descarga_url
              }
            ]
          });
        }

        return acc;
      }, []);

      setBlogs(result)
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    data()
  }, [])

  return (
    <div>
      <div className="main-wrapper">

        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/blog">Blog </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Blogs</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">

              {
                blogs.map((blog) => (
                  <div className="col-sm-6 col-md-6 col-xl-4 mb-4" key={`blog${blog.blog_id}`}>
                    <div className="blog grid-blog">
                      <div className="blog-image">
                        <Link href="/blog">
                          <img
                            className="img-fluid"
                            width={313}
                            height={173}
                            // src={blog.blog_imagen.includes(process.env.NEXT_PUBLIC_KEY_IMG) ? `${blog.blog_imagen}` : `${blog.blog_imagen}${process.env.NEXT_PUBLIC_KEY_IMG}`}
                            src={prepareImg(blog?.blog_imagen)}
                            alt="#"
                          />
                        </Link>

                        {/* <ul className="nav view-blog-list blog-views">
                          <li>
                            <i className="feather-message-square me-1" />
                            <FeatherIcon icon="message-square" />
                            58
                          </li>
                          <li>
                            <i className="feather-eye me-1" />
                            <FeatherIcon icon="eye" />
                            500
                          </li>
                        </ul> */}
                      </div>
                      <div className="blog-content">
                        {/*  <div className="blog-grp-blk">
                          <div className="blog-img-blk">
                            <Link href="/blog">
                              <img
                                className="img-fluid"
                                src={blogimg2.src}
                                alt="#"
                              />
                            </Link>
                            <div className="content-blk-blog ms-2">
                              <h4>
                                <Link href="profile.html">{blog.autor}</Link>
                              </h4>
                              <h5>M.B.B.S, Diabetologist</h5>
                            </div>
                          </div>
                          <span>
                            <i className="feather-calendar me-1" />
                            {blog.fecha_publicacion}
                          </span>
                        </div> */}
                        <h3 className="blog-title">
                          <Link href={`/blog/${blog.blog_id}`}>
                            {blog.blog_titulo}
                          </Link>
                        </h3>
                        <p>
                          {truncarPalabras(extractTextFromHTML(blog.blog_texto), 20)}
                        </p>
                        <Link href={`/blog/${blog.blog_id}`} className="read-more d-flex">
                          {" "}
                          Leer más...
                          <i className="fa fa-long-arrow-right ms-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              }

            </div>
          </div>
          <div className="notification-box">
            <div className="msg-sidebar notifications msg-noti">
              <div className="topnav-dropdown-header">
                <span>Messages</span>
              </div>
              <div className="drop-scroll msg-list-scroll" id="msg_list">
                <ul className="list-box">
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">R</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Richard Miles </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item new-message">
                        <div className="list-left">
                          <span className="avatar">J</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">John Doe</span>
                          <span className="message-time">1 Aug</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">T</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Tarah Shropshire </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">M</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Mike Litorus</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">C</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Catherine Manseau </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">D</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Domenic Houston </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">B</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Buster Wigton </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">R</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Rolland Webber </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">C</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Claire Mapes </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">M</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Melita Faucher</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">J</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Jeffery Lalor</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">L</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Loren Gatlin</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">T</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Tarah Shropshire</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                <Link href="chat.html">See all messages</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Main Wrapper */}
    </div>
  )
}

// export default BlogView;
export default withAuth(BlogView, ['administrador', 'profesional']);
