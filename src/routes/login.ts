import { FastifyInstance } from "fastify";

export default async function usersRoute(fastify: FastifyInstance) {
  fastify.post("/login", async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { email, password } = request.body as {
        email?: string;
        password?: string;
      };
      const findUser = await client.query(
        "SELECT * FROM users WHERE email = $1 ",
        [email]
      );

      if (findUser) {
        if (findUser.rows[0].password === password) {
          const token = fastify.jwt.sign({ email });
          reply.code(201).send({ token, finduser: findUser.rows[0] });
        } else {
          reply.code(401).send("Invalid password");
        }
      } else {
        reply.code(404).send("User not found");
      }
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
      reply.status(500).send("Internal Server Error");
    } finally {
      client.release();
    }
  });
}
