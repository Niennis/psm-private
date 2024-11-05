'use client'
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Link from "next/link";
import { Table } from "antd";
import { onShowSizeChange, itemRender } from "../../components/Pagination";
import { imagesend, plusicon, refreshicon, searchnormal } from "../../components/imagepath";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import 'bootstrap/dist/css/bootstrap.min.css';

import { fetchScheduleByUser, getSpecialities } from "@/services/SchedulesServices";
import { fetchDoctors, fetchDoctor, addDoctor, updateDoctor } from '../../services/DoctorsServices';
import { useForm } from 'react-hook-form';

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import ProtectedPage from "@/components/ProtectedRoutes";

const ScheduleList = () => {
  const ROL = ["profesional"]
  const { data: session } = useSession()
  const router = useRouter();

  const [doctors, setDoctors] = useState([])
  const [results, setResults] = useState([])
  const [dropdownValue, setDropdownValue] = useState('');
  const [show, setShow] = useState({ state: false, id: '' })
  const [idSchedule, setIdSchedule] = useState('')

  // const handleDropdownChange = (value) => {
  //   setDropdownValue(value);
  // };
  const { register, handleSubmit, watch, control,
    formState: { errors }
  } = useForm()

  const fetchSchedules = () => {

  }

  useEffect(() => {
    const fetchData = async () => {
      const { users } = await fetchDoctors()
      const { response } = await getSpecialities()

      const usersAndSPeciality = users.map(user => {
        const result = response.find(el => el.usuario_id === user.id)
        return {
          ...user,
          especialidad: !result ? 'Psicologia' : result.especialidad,
          AvailableDays: "Lun - Vie",
          AvailableTime: "09:00 AM - 06:00 PM",
        }
      })
      setDoctors(usersAndSPeciality)
      setResults(usersAndSPeciality)
    }
    fetchData()
  }, [])

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
  if (!session && !session?.user?.rol === "admin"
    // || !session?.user?.rol === "profesional"
  ) {
    // Redirige al usuario a la página de inicio de sesión si no está autenticado
    router.push('/');
    return null;
  }

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleCancel = () => {
    console.log('ID', id, idSchedule)
    changeStatusAppointment(id, 'cancelada')
  }


  const columns = [
    {
      title: "Nombre",
      dataIndex: "DoctorName",
      render: (text, record) => (
        <>
          <h2 className="profile-image">
            {/* <Link href="#" className="avatar avatar-sm me-2">
              <img
                className="avatar-img rounded-circle"
                src={record.Img}
                alt="rounded circle"
              />
            </Link> */}
            <Link href="#">{`${record.nombre} ${record.apellido}`}</Link>
          </h2>
        </>
      ),
    },
    {
      title: "Especialidad",
      dataIndex: "especialidad",
      sorter: (a, b) => a.Department.length - b.Department.length,
    },
    {
      title: "Días disponibles",
      dataIndex: "AvailableDays",
      sorter: (a, b) => a.AvailableDays.length - b.AvailableDays.length,
    },
    {
      title: "Horas disponibles",
      dataIndex: "AvailableTime",
      sorter: (a, b) => a.AvailableTime.length - b.AvailableTime.length,
    },
    {
      title: 'Estado',
      dataIndex: 'Status',
      // key: 'status',
      render: (text, record) => (
        <div>
          {record.status === "activo" && (
            <span className="custom-badge status-green">
              {record.status}
            </span>
          )}
          {record.status === "inactivo" && (
            <span className="custom-badge status-pink">
              {record.status}
            </span>
          )}
        </div>
        // <Dropdown onSelect={handleDropdownChange}>
        //   <Dropdown.Toggle variant="secondary">
        //     {record.status} <Badge bg="danger">Badge</Badge>
        //   </Dropdown.Toggle>

        //   <Dropdown.Menu>
        //     <Dropdown.Item eventKey="In Progress">In Progress</Dropdown.Item>
        //     <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
        //     <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
        //   </Dropdown.Menu>
        // </Dropdown>
      ),
    },
    // {
    //   title: "Status",
    //   dataIndex: "Status",
    //   sorter: (a, b) => a.Status.length - b.Status.length,
    //   render: (text, record) => (
    //     <>
    //       <Link href="#">{record.Mobile}</Link>
    //     </>
    //   ),
    // },
    {
      title: "",
      dataIndex: "FIELD8",
      render: (text, record) => (
        <>
          <div className="text-end">
            <div className="dropdown dropdown-action">
              <Link
                href="#"
                className="action-icon dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-end">
                <Link className="dropdown-item" href={`/horarios/agregarhorario/${record.id}`}>
                  <i className="far fa-edit me-2" />
                  Agregar
                </Link>
                <Link
                  className="dropdown-item"
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#delete_patient"
                >
                  <i className="fa fa-trash-alt m-r-5"></i> Eliminar
                </Link>
              </div>
            </div>
          </div>
        </>
      ),
    },
    //{
    //     title:"Email",
    //     dataIndex: "Email",
    //         sorter: (a, b) => a.Email.length - b.Email.length
    // }, {
    //     title:"JoiningDate",
    //     dataIndex: "JoiningDate",
    //         sorter: (a, b) => a.JoiningDate.length - b.JoiningDate.length
    // },
  ];


  const columnsMock = [
    {
      title: "Nombre",
      dataIndex: "DoctorName",
      render: (text, record) => (
        <>
          <h2 className="profile-image">
            {/* <Link href="#" className="avatar avatar-sm me-2">
              <img
                className="avatar-img rounded-circle"
                src={record.Img}
                alt="rounded circle"
              />
            </Link> */}
            <Link href="#">{`${record.DoctorName}`}</Link>
          </h2>
        </>
      ),
    },
    {
      title: "Especialidad",
      dataIndex: "Department",
      sorter: (a, b) => a.Department.length - b.Department.length,
    },
    {
      title: "Días disponibles",
      dataIndex: "AvailableDays",
      sorter: (a, b) => a.AvailableDays.length - b.AvailableDays.length,
    },
    {
      title: "Horas disponibles",
      dataIndex: "AvailableTime",
      sorter: (a, b) => a.AvailableTime.length - b.AvailableTime.length,
    },
    {
      title: 'Estado',
      dataIndex: 'Status',
      // key: 'status',
      render: (text, record) => (
        <div>
          {text === "Active" && (
            <span className="custom-badge status-green">
              {text}
            </span>
          )}
          {text === "In Active" && (
            <span className="custom-badge status-pink">
              {text}
            </span>
          )}
        </div>
        // <Dropdown onSelect={handleDropdownChange}>
        //   <Dropdown.Toggle variant="secondary">
        //     {record.status} <Badge bg="danger">Badge</Badge>
        //   </Dropdown.Toggle>

        //   <Dropdown.Menu>
        //     <Dropdown.Item eventKey="In Progress">In Progress</Dropdown.Item>
        //     <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
        //     <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
        //   </Dropdown.Menu>
        // </Dropdown>
      ),
    },
    // {
    //   title: "Status",
    //   dataIndex: "Status",
    //   sorter: (a, b) => a.Status.length - b.Status.length,
    //   render: (text, record) => (
    //     <>
    //       <Link href="#">{record.Mobile}</Link>
    //     </>
    //   ),
    // },
    {
      title: "",
      dataIndex: "FIELD8",
      render: (text, record) => (
        <>
          <div className="text-end">
            <div className="dropdown dropdown-action">
              {console.log(record)}
              <Link
                href="#"
                className="action-icon dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={() => { setShow({ ...show, state: !show.state, id: record.id }) }}
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div
                style={{ right: '30px' }}
                className=
                {show.state === true && show.id === record.id
                  ? "dropdown-menu dropdown-menu-end show"
                  : "dropdown-menu dropdown-menu-end "
                }
              >
                <Link className="dropdown-item" href={`/horarios/agregarhorario/${record.id}`}>
                  <i className="far fa-edit me-2" />
                  Editar
                </Link>
                <Link
                  href="#"
                  className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#delete_appointment"
                  onClick={() => setIdSchedule(record.id)}>
                  <i className="fa fa-trash-alt m-r-5"></i>
                  Eliminar
                </Link>
              </div>
            </div>
          </div>
        </>
      ),
    },
    //{
    //     title:"Email",
    //     dataIndex: "Email",
    //         sorter: (a, b) => a.Email.length - b.Email.length
    // }, {
    //     title:"JoiningDate",
    //     dataIndex: "JoiningDate",
    //         sorter: (a, b) => a.JoiningDate.length - b.JoiningDate.length
    // },
  ];


  return (
    <ProtectedPage level={ROL}>
      <>
        {/* <Headerudp /> */}
        <Sidebar id='menu-item5' id1='menu-items5' activeClassName='shedule-list' />
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Horario profesionales</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Lista de horarios</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    {/* Table Header */}
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Horarios</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search here"
                                  />
                                  <Link className="btn" href="#">
                                    <img
                                      src={searchnormal.src}
                                      alt="#"
                                    />
                                  </Link>
                                </form>
                              </div>
                              <div className="add-group">
                                <Link
                                  href="#"
                                  className="btn btn-primary add-pluss ms-2"
                                >
                                  <img src={plusicon.src} alt="#" />
                                </Link>
                                <Link
                                  href="#"
                                  className="btn btn-primary doctor-refresh ms-2"
                                >
                                  <img src={refreshicon.src} alt="#" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-auto text-end float-end ms-auto download-grp">
                          <Link href="#" className=" me-2">
                            <img
                              src={pdficon.src}
                             alt="#"
                            />
                          </Link>
                          <Link href="#" className=" me-2">
                            <img
                              src={pdficon2}
                             alt="#"
                            />
                          </Link>
                          <Link href="#" className=" me-2">
                            <img
                              src={pdficon3}
                             alt="#"
                            />
                          </Link>
                          <Link href="#">
                            <img
                              src={pdficon4}
                             alt="#"
                            />
                          </Link>
                        </div> */}
                      </div>
                    </div>
                    {/* /Table Header */}
                    <div className="table-responsive">
                      <Table
                        pagination={{
                          total: results.length,
                          showTotal: (total, range) =>
                            `Mostrando ${range[0]} a ${range[1]} de ${total}`,
                          // showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        columns={columns}
                        dataSource={results}
                        rowSelection={rowSelection}
                        rowKey={(record) => record.id}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            id="delete_patient"
            className="modal fade delete-modal"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body text-center">
                  <img src={imagesend.src} alt="#" width={50} height={46} />
                  <h3>Are you sure want to delete this ?</h3>
                  <div className="m-t-20">
                    {" "}
                    <Link
                      href="#"
                      className="btn btn-white me-2"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </Link>
                    <button type="submit" className="btn btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </ProtectedPage>
  );
};

export default ScheduleList;
