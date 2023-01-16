import { Pool } from "pg"

let conn;

if (!conn) {
  conn = new Pool({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "fyp_db",
  })
}

export default conn