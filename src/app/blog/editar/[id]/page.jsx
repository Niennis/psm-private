'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link';

import { useForm, FormProvider } from 'react-hook-form';

import { useSidebar } from "@/context/SidebarContext";
import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";
import { fetchBlog, updateBlog, uploadFile } from '@/services/BlogServices';

import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import { Alert } from '@mui/material';
import { Button } from 'react-bootstrap'

const cacheHandler = new CacheHandler();
const TextEditor = dynamic(
  () => import('@/components/TextEditor'),
  {
    ssr: false,
    loading: () => <p>Loading...</p> // Esto puede ayudar a depurar el proceso de carga
  });

const Editblog = ({ params }) => {
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

  useEffect(() => {
    setProps({
      id: "menu-item11",
      id1: "menu-items11",
      activeClassName: "edit-blog",
    });
  }, [setProps]);

  const formatText = (input) => {
    return input
      .toLowerCase() // Convertir a minúsculas
      .normalize("NFD") // Descomponer caracteres con acentos
      .replace(/[\u0300-\u036f]/g, "") // Eliminar marcas de acentos
      .replace(/ñ/g, "n") // Eliminar la letra "ñ"
      .replace(/[^a-z0-9\s_]/g, "") // Eliminar caracteres especiales, conservando letras, números, espacios y "_"
      .replace(/\s+/g, "-"); // Reemplazar espacios por ""
  }

  const { register, handleSubmit, watch, control, setValue, reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      content: "", // Valor inicial vacío
    },
  });

  const processInlineImagesFromApi = async (content) => {
    const data = watch()
    const imgTagRegex = /<img[^>]*src=['"]([^'"]+)['"][^>]*>/g;
    let match;
    let index = 1;
    imgTagRegex.lastIndex = 0

    while ((match = imgTagRegex.exec(content)) !== null) {
      index++
      const imageUrl = match[1];
      // si tiene la key, devolver la imagen original, si no, agregar la key
      const newUrl = imageUrl.includes(process.env.NEXT_PUBLIC_KEY_IMG) ? imageUrl : `${imageUrl}${process.env.NEXT_PUBLIC_KEY_IMG}`
      content = content.replace(imageUrl, newUrl);
    }
    return content;
  };

  const processArray = arr => {
    let resultado = {};
    let descargas = [];
    arr.forEach(obj => {
      // Agregar claves que empiezan con blog_ 
      Object.keys(obj).forEach(key => {
        if (key.startsWith('blog_')) {
          resultado[key] = obj[key];
        }
      });
      // Agregar objetos descarga_ con sus claves correspondientes 
      let descargaObj = {};
      Object.keys(obj).forEach(key => {
        if (key.startsWith('descarga_')) {
          descargaObj[key] = obj[key];
        }
      });
      if (Object.keys(descargaObj).length > 0) {
        descargas.push(descargaObj);
      }
    });
    resultado['descargas'] = descargas;
    return resultado;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { blogs: response } = await fetchBlog(params.id); // Reemplaza con tu endpoint real
        const initialContent = response[0].blog_texto || ""; // Asegúrate de que 'content' exista en la 
        const processedArray = processArray(response)
        const obj = {
          blog_titulo: processedArray.blog_titulo,
          blog_bajada: processedArray.blog_bajada,
          blog_destacado: processedArray.blog_destacado,
          blog_texto: processedArray.blog_texto,
          // blog_id: response [0]
          // blog_video
          blog_imagen: processedArray.blog_imagen

        }
        const processedText = await processInlineImagesFromApi(processedArray.blog_texto)

        setTexto(processedText)
        setDownloads(processedArray.descargas)
        // Actualiza los valores iniciales del formulario
        reset(obj);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    // https://reposaludmental.blob.core.windows.net/publicsite/prueba-pa-editar2.jpg?sp=rl&st=2024-10-02T00:13:39Z&se=2099-10-02T08:13:39Z&spr=https&sv=2022-11-02&sr=c&sig=GotHrZkZjeRQpnGTT1OxRvuCvwqj%2BJSQkS7Tn5yz8qk%3D
    fetchData();
  }, [reset]);

  const handleEditorChange = (data) => {
    setEditorData(data);  // Actualizamos el estado con el contenido del editor
  };

  const handleRemoveDownload = (id) => {
    setDownloads((prev) => prev.filter((_, index) => index !== id));
    // También actualiza los valores en el formulario 
    setValue('downloads', prev => prev.filter((_, index) => index !== id));
  };

  const getFileNameWithoutExtensionAndPattern = (str, pattern = '?sp') => {
    // Encuentra la posición del último punto (.) en el string
    const dotIndex = str.lastIndexOf('.');

    // Si encuentra un punto en la cadena
    if (dotIndex !== -1) {
      // Busca el patrón a partir del punto
      const patternIndex = str.indexOf(pattern, dotIndex);

      // Si el patrón se encuentra después del punto, corta todo después del patrón
      if (patternIndex !== -1) {
        return str.substring(0, patternIndex); // Devuelve el texto hasta el patrón, incluyendo la extensión
      }
    }

    // Si no se encuentra el patrón, devuelve la cadena original
    return str;
  };


  const removeFromText = (str, matchText) => {
    // Encuentra la posición donde empieza el texto que hace match
    const matchIndex = str.indexOf(matchText);

    // Si el texto se encuentra
    if (matchIndex !== -1) {
      // Devuelve el substring hasta antes del texto que hace match
      return str.substring(0, matchIndex);
    } else {
      // Si el texto no se encuentra, devuelve el string original
      return str;
    }
  }

  const handleFiles = async (file, name, id) => {
    const fileName = formatText(`${name}-${id}`)
    const ext = extension(file)
    const pattern = "?sp"
    const updateExt = removeFromText(ext, pattern)
    const extractFileName = getFileNameWithoutExtensionAndPattern(file)

    const body = {
      "image": file.includes(pattern) ? `${extractFileName}${process.env.NEXT_PUBLIC_KEY_IMG}` : file,
      "file_name": `${fileName}.${updateExt}`
    }
    try {
      const response = await uploadFile(body)
      return response;
    } catch (error) {
      console.log('error', error)
      setMessage(`Ocurrió un error: ${error}`)
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
      // const file = await fetch(imageUrl).then((res) => res.blob());

      const uploadedUrl = await handleFiles(imageUrl, data.blog_titulo, index);
      content = content.replace(imageUrl, uploadedUrl.blob_url);
    }
    return content;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // 1. Subir imagen de cabecera
      const headerImageFile = `${data.blog_imagen}${process.env.NEXT_PUBLIC_KEY_IMG}`;
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
        blog_id: params.id,
        titulo: data.blog_titulo,
        bajada: data.blog_bajada,
        imagen: headerImageUrl.blob_url,
        texto: blogContent,
        destacado: data.blog_destacado,
        video: '',
      };

      const updateResponse = await updateBlog(blogData)
      if (updateResponse.ok ) {
        setSuccess('success')
        setMessage('Datos actualizados exitosamente.')
      } else if (updateResponse.error) {
        setMessage(`Ha ocurrido un error. Revisa el contenido del texto e intenta de nuevo. ${updateResponse.error}`)
        setSuccess('fail')
      } else {
        setMessage(`Ha ocurrido un error. Revisa el contenido del texto e intenta de nuevo.`)
        setSuccess('fail')
      }

      // let count = 0
      // const responses = []
      // for (const download of downloads) {
      //   const file = data[`descarga_url_${download.id}`];
      //   const fileName = formatText(data[`descarga_titulo_${download.id}`])
      //   const ext = extension(data[`descarga_url_${download.id}`])
      //   ('EXT 02', ext)
      //   const bodyDownload = {
      //     "image": file,
      //     "file_name": `${fileName}.${ext}`
      //   }

      //   const fileUrl = await uploadFile(bodyDownload);

      //   const downloadData = {
      //     blog_id: blogResponse.blog_id,
      //     url: fileUrl.blob_url,
      //     titulo: data[`descarga_titulo_${download.id}`],
      //     bajada: data[`descarga_bajada_${download.id}`]
      //   };

      //   const downloadResponse = await createDownload(downloadData)
      //   responses.push(downloadResponse)
      //   if (downloadResponse.message == "Registro insertado correctamente.") {
      //     count = count + 1
      //   }
      // }

      // if (blogResponse.message == "Registro añadido exitosamente." && responses.length === count) {
      //   setSuccess('success')
      //   setMessage('Blog agregado correctamente')
      // } else {
      //   setSuccess('fail')
      //   const objetosConError = arrayDeObjetos.filter(obj => obj.error);
      //   const mensajesError = objetosConError.map(obj => obj.error).join('\n');
      //   const combinedErrors = [blogResponse.error, mensajesError].filter(Boolean).join('\n');

      //   setMessage(combinedErrors);
      // }

    } catch (error) {
      setMessage(`Ha ocurrido un error. Revisa el contenido del texto e intenta de nuevo. ${error}`)
      setSuccess('fail')
    }
  });


  return (
    <div>
      <div className="main-wrapper">
        {/* <DynamicSidebar id='menu-item11' id1='menu-items11' activeClassName='add-blog' /> */}
        {/* page-wrapper-start  */}
        <>
          <div className="page-wrapper">

            <div className="content">
              {/* Page Header */}
              <div className="page-header">
                <div className="row">
                  <div className="col-sm-12">
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link href="#">Blog </Link>
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

                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group local-forms">
                                <label>
                                  Imagen
                                  <span className="login-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  data-role="files"
                                  className="form-control"
                                  accept="image/*,.pdf"
                                  multiple
                                  {...register('blog_imagen')}
                                />
                              </div>
                            </div>



                            <div className="col-12 col-md-6 col-xl-12">
                              <div className="form-group summer-mail">
                                <div className="main-container">
                                  <div
                                    className="editor-container editor-container_classic-editor"
                                    ref={editorContainerRef}
                                  >
                                    <div className="editor-container__editor">
                                      <div ref={editorRef}>
                                        {
                                          texto &&
                                          <TextEditor onEditorChange={handleEditorChange} texto={texto} />
                                        }

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


                            {/*       {
                              downloads.map((item, index) => {
                                return (<DownloadSection
                                  key={index}
                                  id={index}
                                  register={register}
                                  errors={errors}
                                  handleDeleteDownload={() => handleRemoveDownload(index)}
                                  initialData={item}
                                />)
                              })
                            }
 */}

                            {/* <div className="col-12">
                            <div className="form-group select-gender">
                              <label className="gen-label">
                                Estado <span className="login-danger">*</span>
                              </label>
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <input
                                    type="radio"
                                    name="estado"
                                    value="activo"
                                    className="form-check-input"
                                    {...register('estado', {
                                      required: {
                                        value: true,
                                        message: 'Estado es requerido',
                                      }
                                    })}
                                  />
                                  Activo
                                </label>
                              </div>
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <input
                                    type="radio"
                                    name="estado"
                                    value="inactivo"
                                    className="form-check-input"
                                    {...register('estado', {
                                      required: {
                                        value: true,
                                        message: 'Estado es requerido',
                                      }
                                    })}
                                  />
                                  Inactivo
                                </label>
                              </div>
                              {
                                errors.estado
                                && <span className="login-danger">
                                  <small>{errors.estado.message}</small>
                                </span>
                              }
                            </div>
                          </div> */}
                            {/* <div className="col-12 col-md-6 col-xl-6">
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
                            </div> */}
                            <div className="col-12 col-md-6 col-xl-12">
                              <div className="form-group summer-mail">

                              </div>
                            </div>
                            {/* <div className="col-12 col-md-6 col-xl-12">
                            <div className="form-group local-top-form">
                              <label className="local-top">
                                Avatar <span className="login-danger">*</span>
                              </label>
                              <div className="settings-btn upload-files-avator">
                                <input
                                  type="file"
                                  accept="image/*"
                                  name="image"
                                  id="file"
                                  onChange={loadFile}
                                  className="hide-input"
                                />
                                <label htmlFor="file" className="upload">
                                  Escoge un archivo
                                </label>
                              </div>
                            </div>
                          </div> */}
                            <div className="col-12">
                              <div className="doctor-submit text-end">
                                <button
                                  // type="submit"
                                  className="btn btn-primary submit-form me-2"
                                  onClick={onSubmit}
                                >
                                  Editar
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
                      </FormProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div id="delete_patient" className="modal fade delete-modal" role="dialog">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <img src="assets/img/sent.png" alt="" width={50} height={46} />
                    <h3>¿Estás seguro que deseas cancelar</h3>
                    <div className="m-t-20">
                      {" "}
                      <Link href="#" className="btn btn-white" data-bs-dismiss="modal">
                        Cerrar
                      </Link>
                      <button type="submit" className="btn btn-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
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
                : ""
          }
        </>
        {/* page-wrapper-end */}
      </div>
      <div className="sidebar-overlay" data-reff="" />
    </div>
  )
}

// export default Editblog
export default withAuth(Editblog, ['administrador', 'profesional']);
