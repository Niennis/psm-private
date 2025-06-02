"use client"
// import { useState } from "react";
import { Today } from "@mui/icons-material"
// import Modal from "./Modal";
import Link from "next/link"
// import { redirect } from "next/dist/server/api-utils"
import { redirect } from "next/navigation"
import { useMediaQuery } from "@mui/material"

const ReserveBtn = ({ text, bgColor, color }) => {
  // const [open, setOpen] = useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  const matches = useMediaQuery('(min-width:600px)');

  const URL_RESERVAR = process.env.NEXT_PUBLIC_URL_RESERVAR

  return (
    <>
      <Link href={URL_RESERVAR} className="body-regular" >
      <button
        className='btn btn-rounded btn-reservar body-regular'
        style={{
          width: matches ? '130px' : '100px',
          height: matches ? '56px' : '40px',
          // margin: '16px 0',
          backgroundColor: bgColor,
          color: color,
          fontSize: matches ? '16px' : '14px',
          fontWeight: 700,
        }}
      // onClick={handleOpen}
      >
        <Today style={{ margin: matches ? '-2px px 0 0': '-3px 0 0', fontSize: matches ? '15px' : '12px' }} />
        {text}
      </button>
      </Link>
      {/* <Modal open={open} handleClose={handleClose} /> */}
    </>
  )
}

export default ReserveBtn;
