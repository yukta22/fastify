// src/plugins/db.ts
import fastifyPostgres from "@fastify/postgres";
import fp from "fastify-plugin";

export default fp(async (fastify, opts) => {
  await fastify.register(fastifyPostgres, {
    connectionString: "postgres://root:asd@localhost:5432/fastify_db",
  });
});
