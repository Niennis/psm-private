'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'

import { useForm, FormProvider } from 'react-hook-form';

import '../styles/styles.css'

import { useSidebar } from "@/context/SidebarContext";
import withAuth from '@/components/withAuth';

import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import { PlusCircle, MinusCircle } from "feather-icons-react/build/IconComponents";

import { createBlog, uploadFile, createDownload } from '@/services/BlogServices';
import DownloadSection from '@/components/DownloadsSection';
import { Alert } from '@mui/material';
import { Button } from 'react-bootstrap'

const TextEditor = dynamic(
  () => import('@/components/TextEditor'),
  {
    ssr: false,
    loading: () => <p>Loading...</p> // Esto puede ayudar a depurar el proceso de carga
  });
// import TextEditor from '@/components/TextEditor';

const Addblog = () => {
  const { setProps } = useSidebar();
  const [texto, setTexto] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [downloads, setDownloads] = useState([{ id: 1 }]);
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [editorData, setEditorData] = useState('');
  const [success, setSuccess] = useState('initial')
  const [message, setMessage] = useState('')
  const methods = useForm()

  const [editorLoaded, setEditorLoaded] = useState(false);
  useEffect(() => {
    setProps({
      id: "menu-item11",
      id1: "menu-items11",
      activeClassName: "add-blog",
    });
  }, [setProps]);

  const { register, handleSubmit, watch, control, setValue,
    formState: { errors }
  } = useForm()

  const formatText = (input) => {
    return input
      .toLowerCase() // Convertir a minúsculas
      .normalize("NFD") // Descomponer caracteres con acentos
      .replace(/[\u0300-\u036f]/g, "") // Eliminar marcas de acentos
      .replace(/ñ/g, "n") // Eliminar la letra "ñ"
      .replace(/[^a-z0-9\s_]/g, "") // Eliminar caracteres especiales, conservando letras, números, espacios y "_"
      .replace(/\s+/g, "-"); // Reemplazar espacios por ""
  }

  const generateDirectDownloadLink = (driveUrl) => {
    try {
      // Verificar si la URL es válida
      const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (!match || match.length < 2) {
        throw new Error("URL inválida. Asegúrate de proporcionar una URL de Google Drive válida.");
      }

      // Extraer el FILE_ID de la URL
      const fileId = match[1];

      // Construir el enlace directo
      const directDownloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
      return directDownloadLink;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }


  const handleAddDownload = () => {
    setDownloads((prev) => [...prev, { id: prev.length + 1 }]);
  };

  const handleRemoveDownload = (id) => {
    setDownloads((prev) => prev.filter((download) => download.id !== id));
  };

  const handleEditorChange = (data) => {
    setEditorData(data);  // Actualizamos el estado con el contenido del editor
  };

  const handleFiles = async (file, name, id) => {
    const fileName = formatText(`${name}-${id}`)
    const ext = extension(file)

    const body = {
      "image": file,
      "file_name": `${fileName}.${ext}`
    }
    try {
      const response = await uploadFile(body)
      return response;
    } catch (error) {
      console.log('error', error)
    }
  }

  const extension = url => url.split('.').pop();

  const processInlineImages = async (content) => {
    const data = watch()
    const imgTagRegex = /<img[^>]*src=['"]([^'"]+)['"][^>]*>/g;
    let match;
    let index = 1;
    imgTagRegex.lastIndex = 0

    while ((match = imgTagRegex.exec(content)) !== null) {
      index++
      const imageUrl = match[1];
      const file = await fetch(imageUrl).then((res) => res.blob());

      const uploadedUrl = await handleFiles(imageUrl, data.blog_titulo, index);
      content = content.replace(imageUrl, uploadedUrl.blob_url);
    }
    return content;
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log('data', data)
    try {
      // 1. Subir imagen de cabecera
      const headerImageFile = data.blog_imagen;
      const headerImageUrl = await handleFiles(headerImageFile, data.blog_titulo, 0);

      // 2. Procesar imágenes en línea en el texto del blog
      let blogContent = editorData;
      blogContent = await processInlineImages(blogContent);
      if (blogContent.error) {
        setMessage(`Ha ocurrido un error. Revisa el contenido del texto e intenta de nuevo. ${blogContent.error}`)
        setSuccess('fail')
        return;
      }

      // 3. Crear el blog
      const blogData = {
        titulo: data.blog_titulo,
        bajada: data.blog_bajada,
        imagen: headerImageUrl.blob_url,
        texto: blogContent,
        destacado: data.blog_destacado,
        video: '',
      };

      const blogResponse = await createBlog(blogData)
      if (blogResponse.error) {
        setMessage(`Ha ocurrido un error. Revisa el contenido del texto e intenta de nuevo. ${blogResponse.error}`)
        setSuccess('fail')
        return;
      }

      let count = 0
      // 4. Subir archivos de descargas y crear entradas de descargas
      const responses = []
      for (const download of downloads) {
        const file = data[`descarga_url_${download.id}`];
        const fileName = formatText(data[`descarga_titulo_${download.id}`])
        const ext = extension(data[`descarga_url_${download.id}`])
        const bodyDownload = {
          "image": file,
          "file_name": `${fileName}.${ext}`
        }

        const fileUrl = await uploadFile(bodyDownload);

        const downloadData = {
          blog_id: blogResponse.blog_id,
          url: fileUrl.blob_url,
          titulo: data[`descarga_titulo_${download.id}`],
          bajada: data[`descarga_bajada_${download.id}`]
        };

        const downloadResponse = await createDownload(downloadData)
        responses.push(downloadResponse)
        if (downloadResponse.message == "Registro insertado correctamente.") {
          count = count + 1
        }
      }

      if (blogResponse.message == "Registro añadido exitosamente." && responses.length === count) {
        setSuccess('success')
        setMessage('Blog agregado correctamente')
      } else {
        setSuccess('fail')
        // const objetosConError = arrayDeObjetos.filter(obj => obj.error);
        // const mensajesError = objetosConError.map(obj => obj.error).join('\n');
        // const combinedErrors = [blogResponse.error, mensajesError].filter(Boolean).join('\n');

        // setMessage(combinedErrors);
        setMessage('')
      }

    } catch (error) {
      console.error("Error al procesar:", error);
      // if(error.includes('not defined')){
      //   setMessage(`Elemento no encontrado: ${error}`)
      // }
      setMessage(`Hubo un error: ${error}`)
    }
  });

  return (
    <div>
      <div className="main-wrapper">
        <>
          <div className="page-wrapper mt-5 pt-5">

            <div className="content">
              {/* Page Header */}
              <div className="page-header">
                <div className="row">
                  <div className="col-sm-12">
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item">
                        {/* <Link href="#">Blog </Link> */}
                      </li>
                      <li className="breadcrumb-item">
                        <i className="feather-chevron-right">
                          <FeatherIcon icon="chevron-right" />
                        </i>
                      </li>
                      <li className="breadcrumb-item active">Agregar Blogs</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-body">
                      <FormProvider {...methods}>

                        <form>
                          <div className="row">
                            <div className="col-12">
                              <div className="form-heading">
                                <h4>Detalles</h4>
                              </div>
                            </div>
                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  Título <span className="login-danger">*</span>
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder=""
                                  {...register('blog_titulo', {
                                    required: {
                                      value: true,
                                      message: 'Título es requerido',
                                      maxLength: {
                                        value: 50,
                                        message: 'El título no puede tener más de 50 caracteres',
                                      }
                                    }
                                  })}
                                />
                                {
                                  errors.blog_titulo
                                  && <span className="login-danger">
                                    <small>{errors.blog_titulo.message}</small>
                                  </span>
                                }
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-group local-forms">
                                <label>
                                  Descripción <span className="login-danger">*</span>
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder=""
                                  {...register('blog_bajada', {
                                    required: {
                                      value: true,
                                      message: 'Nombre de autor es requerido',
                                      maxLength: {
                                        value: 50,
                                        message: 'El título no puede tener más de 50 caracteres',
                                      }
                                    }
                                  })}
                                />
                                {
                                  errors.blog_bajada
                                  && <span className="login-danger">
                                    <small>{errors.blog_bajada.message}</small>
                                  </span>
                                }
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  Agregar url imagen cabecera
                                  <span className="login-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  data-role="files"
                                  className="form-control"
                                  accept="image/*"
                                  multiple
                                  {...register('blog_imagen', {
                                    required: {
                                      value: true,
                                    }
                                  })
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group select-gender">
                                <label className="gen-label">
                                  ¿Destacar? <span className="login-danger">*</span>
                                </label>
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="checkbox"
                                      name="blog_destacado"
                                      value="activo"
                                      className="form-check-input"
                                      {...register('blog_destacado')}
                                    />
                                    Sí
                                  </label>
                                </div>

                                {
                                  errors.blog_destacado
                                  && <span className="login-danger">
                                    <small>{errors.blog_destacado.message}</small>
                                  </span>
                                }
                              </div>
                            </div>
                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group summer-mail">
                                <div className="main-container">
                                  <div
                                    className="editor-container editor-container_classic-editor"
                                    ref={editorContainerRef}
                                  >
                                    <div className="editor-container__editor">
                                      <div ref={editorRef}>
                                        <TextEditor onEditorChange={handleEditorChange} />

                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {
                                  errors.blog_texto
                                  && <span className="login-danger">
                                    <small>{errors.blog_texto.message}</small>
                                  </span>
                                }
                              </div>
                            </div>


                            <div className="col-12">
                              <div className="form-heading">
                                <h4>Agregar material descargable {disabled ? '' : <PlusCircle
                                  onClick={() => { handleAddDownload() }} disabled={downloads.length >= 3}
                                />}</h4>
                                {downloads.length >= 3 && (
                                  <p style={{ color: "red" }}>Has alcanzado el límite de 3 descargas.</p>
                                )}
                              </div>
                            </div>

                            {downloads.map((download) => (
                              <DownloadSection
                                key={download.id}
                                id={download.id}
                                register={register}
                                errors={errors}
                                handleDeleteDownload={() => handleRemoveDownload(download.id)}
                              />
                            ))}

                            <div className="col-12">
                              <div className="doctor-submit text-end">
                                <button
                                  // type="submit"
                                  className="btn btn-primary submit-form me-2"
                                  onClick={onSubmit}
                                >
                                  Publicar
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary cancel-form"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </ FormProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {
            success === 'success'
              ?
              <div style={{
                height: '100%',
                position: 'fixed',
                top: '0',
                width: '105%',
                zIndex: 99999,
                background: '#00000080',
                marginLeft: "-12px",
              }}>
                {/* <div className="col-sm-12 col-lg-6"> */}
                <Alert
                  severity="success"
                  onClose={() => { setSuccess('initial') }}
                  sx={{
                    zIndex: 'tooltip',
                    position: 'absolute',
                    left: '30%',
                    width: '50%',
                    padding: '50px',
                    bottom: '50vh'
                  }}
                // spacing={2}
                >
                  {message}
                </Alert>
                {/* </div> */}
              </div>

              : success === 'fail'
                ?
                <div className="row" style={{
                  height: '100%',
                  position: 'fixed',
                  top: '0',
                  width: '100%',
                  zIndex: 99999,
                  background: '#00000080'
                }}>
                  <div className="col-sm-12 col-lg-6">
                    <Alert
                      severity="error"
                      onClose={() => { setSuccess('initial') }}
                      sx={{
                        zIndex: 'tooltip',
                        position: 'absolute',
                        left: '30%',
                        width: '50%',
                        padding: '50px',
                        bottom: '50vh'
                      }}
                    // spacing={2}
                    >
                      {message}
                    </Alert>
                  </div>
                </div>
                : success === 'warning'
                  ?
                  <div className="row" style={{
                    height: '100%',
                    position: 'fixed',
                    top: '0',
                    width: '100%',
                    zIndex: 99999,
                    background: '#00000080'
                  }}>
                    <div className="col-sm-12 col-lg-6">
                      <Alert
                        severity="warning"
                        onClose={() => { setSuccess('initial') }}
                        sx={{
                          zIndex: 'tooltip',
                          position: 'absolute',
                          left: '30%',
                          width: '50%',
                          padding: '50px',
                          bottom: '50vh'
                        }}
                      // spacing={2}
                      >
                        <h4>{message}</h4>
                        <Button variant="primary" onClick={handleDelete}> Confirmar </Button>
                      </Alert>
                    </div>
                  </div>
                  : ""
          }



        </>
        {/* page-wrapper-end */}
      </div>
      <div className="sidebar-overlay" data-reff="" />
    </div>
  )
}

export default withAuth(Addblog, ['administrador', 'profesional']);