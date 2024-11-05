'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import Link from 'next/link';
import dynamic from 'next/dynamic'

// import TextEditor from '../../../components/TextEditor';
// import Sidebar from '../../../components/Sidebar';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import Select from "react-select";
import { useForm, Controller } from 'react-hook-form';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import ProtectedPage from '@/components/ProtectedRoutes';

const DynamicSidebar = dynamic(() => import('../../../components/Sidebar'), {
  loading: () => <p>Loading...</p>,
})

const DynamicTextEditor = dynamic(() => import('../../../components/TextEditor'), {
  loading: () => <p>Loading...</p>,
})

const Addblog = () => {
  const ROL = ["admin"]
  const { data: session } = useSession()
  const router = useRouter();
  // useAuthorization(['alumno'])

  const loadFile = (event) => {
    // Handle file loading logic here
  };

  const [selectedOption, setSelectedOption] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const blog = [
    { value: 1, label: "Psicología" },
    { value: 2, label: "Psicopedagogía" },
    { value: 3, label: "Psiquiatría" }
  ];
  const category = [
    { value: 1, label: "Estrés" },
    { value: 2, label: "Concentración" },
    { value: 3, label: "Estudios" },
  ];

  const { register, handleSubmit, watch, control,
    formState: { errors }
  } = useForm()

  const onSubmit = handleSubmit(async data => {
    console.log(data)
  })

  return (
    <ProtectedPage level={ROL}>
      <div className="main-wrapper">
        <DynamicSidebar id='menu-item11' id1='menu-items11' activeClassName='add-blog' />
        {/* page-wrapper-start  */}
        <>
          <div className="page-wrapper mt-5 pt-5">

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
                                {...register('title', {
                                  required: {
                                    value: true,
                                    message: 'Título es requerido',
                                  }
                                })}
                              />
                              {
                                errors.title
                                && <span className="login-danger">
                                  <small>{errors.title.message}</small>
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
                                {...register('author_name', {
                                  required: {
                                    value: true,
                                    message: 'Nombre de autor es requerido',
                                  }
                                })}
                              />
                              {
                                errors.author_name
                                && <span className="login-danger">
                                  <small>{errors.author_name.message}</small>
                                </span>
                              }
                            </div>
                          </div>
                          {/* <div className="col-12 col-md-6 col-xl-6">
                            <div className="form-group local-forms">
                              <label>
                                Profesión autor <span className="login-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                placeholder=""
                                {...register('profession', {
                                  required: {
                                    value: true,
                                    message: 'Profesión del autor es requerida',
                                  }
                                })}
                              />
                              {
                                errors.profession
                                && <span className="login-danger">
                                  <small>{errors.profession.message}</small>
                                </span>
                              }
                            </div>
                          </div> */}
                          {/* <div className="col-12 col-md-6 col-xl-6">
                            <div className="form-group local-forms">
                              <label>
                                Categorías <span className="login-danger">*</span>
                              </label> <Controller
                                control={control}
                                name="category"
                                {...register('category', {
                                  required: {
                                    value: true,
                                    message: 'Categoría es requerida',
                                  }
                                })}
                                ref={null}
                                render={({ field: { onChange, onBlur, value } }) => (
                                  <Select
                                    className="custom-react-select"
                                    defaultValue={selectedOption}
                                    onChange={setSelectedOption}
                                    menuPortalTarget={document.body}
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    options={blog}
                                    id="search-commodity"
                                    components={{
                                      IndicatorSeparator: () => null
                                    }}
                                    styles={{
                                      control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1);',
                                        boxShadow: state.isFocused ? '0 0 0 1px #2e37a4' : 'none',
                                        '&:hover': {
                                          borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1)',
                                        },
                                        borderRadius: '10px',
                                        fontSize: "14px",
                                        minHeight: "45px",
                                      }),
                                      dropdownIndicator: (base, state) => ({
                                        ...base,
                                        transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : 'rotate(0)',
                                        transition: '250ms',
                                        width: '35px',
                                        height: '35px',
                                      }),
                                    }}
                                  />
                                )}
                              />
                              {
                                errors.category
                                && <span className="login-danger">
                                  <small>{errors.category.message}</small>
                                </span>
                              }
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-xl-6">
                            <div className="form-group local-forms">
                              <label>
                                Subcategorías{" "}
                                <span className="login-danger">*</span>
                              </label>
                              <Controller
                                control={control}
                                name="subcategory"
                                {...register('subcategory')}
                                ref={null}
                                render={({ field: { onChange, onBlur, value } }) => (
                                  <Select
                                    className="custom-react-select"
                                    defaultValue={selectedOption}
                                    onChange={setSelectedOption}
                                    menuPortalTarget={document.body}
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    options={category}
                                    id="search-commodity"
                                    components={{
                                      IndicatorSeparator: () => null
                                    }}
                                    styles={{
                                      control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1);',
                                        boxShadow: state.isFocused ? '0 0 0 1px #2e37a4' : 'none',
                                        '&:hover': {
                                          borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1)',
                                        },
                                        borderRadius: '10px',
                                        fontSize: "14px",
                                        minHeight: "45px",
                                      }),
                                      dropdownIndicator: (base, state) => ({
                                        ...base,
                                        transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : 'rotate(0)',
                                        transition: '250ms',
                                        width: '35px',
                                        height: '35px',
                                      }),
                                    }}
                                  />
                                )}
                              />
                            </div>
                          </div> */}
                          {/* <div className="col-12 col-md-6 col-xl-6">
                            <div className="form-group local-forms">
                              <label>
                                Tags <small>(separadas con una coma)</small>{" "}
                                <span className="login-danger">*</span>
                              </label>
                              <input
                                type="text"
                                data-role="tagsinput"
                                className="form-control"
                                {...register('tags')}
                              />
                            </div>
                          </div> */}
                          {/* <div className="col-12 col-md-6 col-xl-6">
                            <div className="form-group local-forms">
                              <label>
                                Agregar imágenes
                                <span className="login-danger">*</span>
                              </label>
                              <input
                                type="file"
                                data-role="files"
                                className="form-control"
                                accept="image/*,.pdf"
                                multiple
                                {...register('tags')}
                              />
                            </div>
                          </div> */}
                          <div className="col-12 col-md-6 col-xl-6">
                            <div className="form-group local-forms">
                              <label>
                                Agregar archivos descargables
                                <span className="login-danger">*</span>
                              </label>
                              <input
                                type="file"
                                data-role="files"
                                className="form-control"
                                accept="image/*,.pdf"
                                multiple
                                {...register('tags')}
                              />
                            </div>
                          </div>
                          <div className="col-12">
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
                                  Sí
                                </label>
                              </div>
                             
                              {
                                errors.estado
                                && <span className="login-danger">
                                  <small>{errors.estado.message}</small>
                                </span>
                              }
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-xl-12">
                            <div className="form-group summer-mail">
                              <Controller
                                control={control}
                                name="content"
                                {...register('content', {
                                  required: {
                                    value: true,
                                    message: 'Contenido es requerido',
                                  }
                                })}
                                ref={null}
                                render={({ field: { onChange, onBlur, value } }) => (
                                  <DynamicTextEditor />
                                )}
                              />
                              {
                                errors.content
                                && <span className="login-danger">
                                  <small>{errors.content.message}</small>
                                </span>
                              }
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
                                type="submit"
                                className="btn btn-primary submit-form me-2"
                                onSubmit={onSubmit}
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
        </>
        {/* page-wrapper-end */}
      </div>
      <div className="sidebar-overlay" data-reff="" />
    </ProtectedPage>
  )
}

export default Addblog
/* 
  < div >
  <>
    <article>

      <h1>Técnicas de Respiración para el Control de la Ansiedad</h1>

      <p>La ansiedad es una respuesta natural del cuerpo ante situaciones percibidas como amenazantes. Sin embargo, cuando se vuelve crónica, puede interferir significativamente en nuestras vidas. Afortunadamente, existen técnicas de respiración que pueden ayudarnos a gestionar y reducir la ansiedad de manera efectiva. A continuación, se presenta una tabla con un resumen de diferentes técnicas de respiración que pueden ser especialmente útiles.</p>



      <table border="1">

        <thead>

          <tr>

            <th>Técnica</th>

            <th>Descripción</th>

            <th>Beneficios</th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td>Respiración Profunda</td>

            <td>Consiste en inhalar profundamente por la nariz, llenando los pulmones y el abdomen, seguido de una exhalación lenta y completa por la boca.</td>

            <td>Reduce la respuesta de estrés, mejora la oxigenación y promueve la calma.</td>

          </tr>

          <tr>

            <td>Respiración 4-7-8</td>

            <td>Inhalar por la nariz contando hasta 4, mantener la respiración durante 7 segundos, y exhalar completamente por la boca contando hasta 8.</td>

            <td>Ayuda a controlar la ansiedad, mejora el sueño y la concentración.</td>

          </tr>

          <tr>

            <td>Respiración de Caja</td>

            <td>Se inhala durante 4 segundos, se retiene la respiración durante 4 segundos, se exhala durante 4 segundos, y se mantiene sin respirar otros 4 segundos.</td>

            <td>Induce la relajación, reduce el estrés y mejora el control emocional.</td>

          </tr>

          <tr>

            <td>Respiración Diafragmática</td>

            <td>Enfocarse en expandir el diafragma al inhalar, promoviendo una respiración más profunda y eficiente.</td>

            <td>Mejora la capacidad pulmonar, reduce la ansiedad y aumenta la sensación de tranquilidad.</td>

          </tr>

        </tbody>

      </table>



      <h2>Resumen General</h2>

      <ul>

        <li><strong>Respiración Profunda:</strong> Una técnica simple pero poderosa para promover la calma y reducir la tensión.</li>

        <li><strong>Respiración 4-7-8:</strong> Ideal para momentos de alta ansiedad y para mejorar el sueño.</li>

        <li><strong>Respiración de Caja:</strong> Útil para gestionar momentos de estrés agudo y mejorar la concentración.</li>

        <li><strong>Respiración Diafragmática:</strong> Favorece una respiración más eficiente y un estado de relajación profunda.</li>

      </ul>



      <p>Estas técnicas de respiración, al practicarse regularmente, pueden ser una herramienta valiosa para el manejo de la ansiedad. Integra estas prácticas en tu rutina diaria y observa cómo mejora tu capacidad para gestionar el estrés y la ansiedad.</p>

    </article>
  </>

</div >
 */