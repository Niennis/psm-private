// app/grupos/layout.js
"use client";
import { GroupProvider } from "@/providers/GroupsProvider";

export default function GruposLayout({ children }) {
  return <GroupProvider>{children}</GroupProvider>
}