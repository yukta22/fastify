import { FastifyInstance } from "fastify";
import databasePlugin from "../plugins/db";

export default async function usersRoute(fastify: FastifyInstance) {
  fastify.get("/users", async (request, reply) => {
    try {
      const client = await fastify.pg.connect();
      const result = await client.query("SELECT * FROM users");
      client.release();

      // Check if the result has rows
      if (result.rows && result.rows.length > 0) {
        console.log(result.rows);
        reply.send(result.rows);
      } else {
        console.log("No records found.");
        reply.send("No records found.");
      }
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
      reply.status(500).send("Internal Server Error");
    }
  });

  fastify.post("/register", async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { email, password } = request.body as {
        email?: string;
        password?: string;
      };
      const result = await client.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [email, password]
      );
      //   console.log(result);

      reply.status(201).send("Successfully Inserted");
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
      reply.status(500).send("Internal Server Error");
    } finally {
      client.release();
    }
  });
  fastify.put("/:id", async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const id = Number((request.params as { id: string }).id);
      const { email, password } = request.body as {
        email?: string;
        password?: string;
      };
      const result = await client.query(
        `UPDATE users SET email = $1, password = $2 WHERE id = $3`,
        [email, password, id]
      );
      console.log(result);

      reply.status(201).send("Successfully Updated");
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
      reply.status(500).send("Internal Server Error");
    } finally {
      client.release();
    }
  });
  fastify.delete("/:id", async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const id = Number((request.params as { id: string }).id);

      const result = await client.query(`DELETE FROM users where id = $1`, [
        id,
      ]);

      reply.status(201).send("Successfully Deleted");
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
      reply.status(500).send("Internal Server Error");
    } finally {
      client.release();
    }
  });
}
