'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import withAuth from '@/components/withAuth';
import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useGroupContext } from '@/providers/GroupsProvider';
import Image from 'next/image';

import Link from 'next/link';
import { Form, Switch, Table } from 'antd';
import { onShowSizeChange, itemRender } from '@/components/Pagination'
import { search } from '@/services/AppointmentsServices'
import { fetchProfessionalsAndAdmins } from '@/services/DoctorsServices';
import { showGroups, showAllGroups } from '@/services/GroupServices';

import { imagesend, plusicon, refreshicon, searchnormal } from '@/components/imagepath';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import SimpleBackdrop from '@/components/Backdrop';
import Welcome from '@/components/Welcome';

const GroupsList = () => {
  const { data: session } = useSession()
  const router = useRouter();
  const { setProps } = useSidebar();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState({ state: false, id: '' })
  const [groups, setGroups] = useState([])
  const [groupId, setGroupId] = useState()
  const { setSelectedGroupId } = useGroupContext();

  useEffect(() => {
    setProps({
      id: "menu-item5",
      id1: "menu-items5",
      activeClassName: "group-list",
    });
  }, [setProps]);

  const getGroups = async () => {
    try {
      const response = await showAllGroups()
      const gruposArray = Object.values(response);

      setGroups(gruposArray)
      setLoading(false);

    } catch (error) {
      console.log('Error: ', error)
      setLoading(false);
      return {};
    } finally {
      // Cambia isLoading a false cuando termina la carga
      setLoading(false);
    }
  }

  useEffect(() => {
    getGroups()
  }, [])


  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const onChange = (date, dateString) => {
  };

  const handleSearch = (e) => {
    const result = search(doctors, e)
    setGroups(result)
  }

  const handleRefresh = () => {
    setGroups(doctors)
  }

  const handleEdit = (grupoId) => {
    setSelectedGroupId(grupoId); // Guarda el ID en el contexto
    router.push("/grupos/editar");
  };

  /* Encabezados de la tabla */
  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      fixed: 'left',
      render: (text, record) => (
        <>
          <h2 className="profile-image">
            {record.nota}
          </h2>
        </>
      ),
      sorter: (a, b) => a.nota.localeCompare(b.nota),
    },
    {
      title: "",
      dataIndex: "id",
      fixed: 'left',
      align: 'right',
      render: (text, record) => (
        <div>

          <button
            className="custom-badge status-green m-1 "
            style={{ cursor: 'pointer', hover: { color: 'red' } }}
            onClick={() => handleEdit(record.uuid)}
          >
            Ver más
          </button>
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "FIELD8",
      fixed: 'right',
      render: (text, record) => (
        <>
          <div className="text-end">
            <div className="dropdown dropdown-action">
              <button
                style={{ border: 'none' }}
                className="action-icon dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={() => { setShow({ ...show, state: !show.state, id: record.uuid }) }}
              >
                <i className="fas fa-ellipsis-v" />
              </button>
              <div
                style={{ right: '35px', top: 0 }}
                className=
                {show.state === true && show.id === record.uuid
                  ? "dropdown-menu dropdown-menu-end dropdown-extra show"
                  : "dropdown-menu dropdown-menu-end dropdown-extra"
                }
                onMouseLeave={() => {
                  if (show.state === true && show.id === record.uuid) {
                    setShow({ state: false, id: null })
                  }
                }}
              >
                <button
                  type="submit"
                  className="dropdown-item"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => handleEdit(record.uuid)}
                >
                  <i className="far fa-edit me-2" />
                  Editar grupo
                </button>
                {/* <Link
                  href="#"
                  className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#delete_patient">
                  <i className="fa fa-trash-alt m-r-5"></i>
                  Eliminar
                </Link> */}
              </div>
            </div>
          </div>
        </>
      ),
    },
  ]

  const tableProps = {
    loading,
  };

  return (
    < >
      <div className="sidebar-overlay" data-reff="" style={{ zIndex: 98 }} />
      {/* <Sidebar id='menu-item1' id1='menu-items1' activeClassName='doctor-list' /> */}
      <div className="page-wrapper">
        <div className="content">

          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="#">Grupos </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                      <FeatherIcon icon="chevron-right" />
                    </i>
                  </li>
                  <li className="breadcrumb-item active">Lista Grupos</li>
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
                        <div className="doctor-table-blk mobile-header">
                          <h3>Lista Grupos</h3>
                          <div className="doctor-search-blk">
                            <div className="top-nav-search table-search-blk mobile-header">
                              <form>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Busca aquí"
                                  onChange={(e) => { handleSearch(e.target.value) }}
                                />
                                <Link className="btn" href="#">
                                  <Image
                                    src={searchnormal}
                                    alt="#"
                                  />
                                </Link>
                              </form>
                            </div>
                            <div className="add-group">

                              <span
                                onClick={() => {
                                  setLoading(true)
                                  router.push("/grupos/crear")
                                }}
                                className="btn btn-primary add-pluss ms-2"
                              >
                                <Image src={plusicon} alt="#" />
                              </span>

                              <Link
                                href="#"
                                onClick={handleRefresh}
                                className="btn btn-primary doctor-refresh ms-2"
                              >
                                <Image src={refreshicon} alt="#" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  {/* /Table Header */}
                  <div className="table-responsive doctor-list">
                    {loading ? (
                      <SimpleBackdrop />
                    ) : (
                      <Table
                        {...tableProps}
                        pagination={{
                          total: groups.length,
                          showTotal: (total, range) =>
                            `Mostrando ${range[0]} a ${range[1]} de ${total} entradas`,
                          // showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        columns={columns}
                        dataSource={groups}

                        // rowSelection={rowSelection}
                        rowKey={(record) => record.uuid}
                        style={{
                          backgroundColor: '#f2f2f2',
                        }}
                      />)
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default withAuth(GroupsList, ['administrador', 'profesional', 'blend']);

