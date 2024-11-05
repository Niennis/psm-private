// import Credentials from "next-auth/providers/credentials";
// import executeQuery from "./MySQLConnect";

// export const authOptions = {
//   session: {
//     strategy: "jwt",
//     maxAge: 2 * 24 * 60 * 60
//   },
//   providers: [
//     Credentials({
//       type: "credentials",
//       credentials: {
//         email: {
//           label: "email",
//           type: "email",
//           placeholder: "Ingresa tu email"
//         },
//         password: {
//           label: "password",
//           type: "password",
//           placeholder: "Ingresa tu contraseña"
//         }
//       },
//       async authorize(credentials){
//         const {email, password} = credentials
//         const query = `select * from usuarios where tipo_usuario = "profesional and email= "${email}" and contrasena= "${password}"`
//         const user = await executeQuery(query, [])
//         if (user){
//           return {user}
//         } else {
//           return null
//         }
//       }
//     })
//   ]
// }