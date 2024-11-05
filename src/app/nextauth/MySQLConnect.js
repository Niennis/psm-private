// import mysql from 'mysql2/promise'

// const executeQuery = async (query, data) => {

//   try {
//     const db = await mysql.createConnection({
//       host: NEXT_PUBLIC_HOST,
//       port: NEXT_PUBLIC_PORT,
//       database: NEXT_PUBLIC_DATABASE,
//       user: NEXT_PUBLIC_USER,
//       password: NEXT_PUBLIC_PASSWORD,
//     })
//     const [result] = await db.execute(query, data)
//     db.end()
//     return result
//   } catch (error) {
//     return null
//   }
// }

// export default executeQuery