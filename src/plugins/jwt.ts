import fp from "fastify-plugin";

export default fp(async function (fastify, opts) {
  fastify.register(import("@fastify/jwt"), {
    secret: "supersecret",
  });
  fastify.decorate("authenticate", async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
      reply.status(500).send("Internal Server Error");
    }
  });
});
