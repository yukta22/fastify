import fastify from "fastify";
export default async function product(fastify: any): Promise<void> {
  fastify.get(
    "/protected",
    {
      onRequest: [fastify.authenticate],
    },
    async (request: any, reply: any) => {
      try {
        return request.user;
        // reply.send({ message: "Authorized User" });
      } catch (err) {
        const error = err as Error;
        console.log(error.message);
        reply.status(500).send("Internal Server Error");
      }
    }
  );
}
