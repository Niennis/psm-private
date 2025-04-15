"use client";
import { UserProvider } from "@/context/UserContext";

function UserWrapper({ children }) {
  return <UserProvider>{children}</UserProvider>;
}

export default UserWrapper;
