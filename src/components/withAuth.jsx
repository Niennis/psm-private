"use client"
import { sessionStatus } from "../auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function withAuth(Component) {
  return function WithAuth(props) {
    const session = sessionStatus;
    useEffect(() => {
      if (!session) {
        redirect("/")
      }
    }, [])
    if(!session) {
      return null
    }
    return <Component {...props} />
  }
}