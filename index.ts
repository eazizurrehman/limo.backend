import { createServer } from "node:http";
import { createApplication } from "@/app";
import { env } from "@/env";

function main() {
  try {
    const server = createServer(createApplication());

    server.listen(env.PORT, () => {
      console.log(
        `\n\x1b[42m\x1b[30m 🚀 Http server is running on port ${env.PORT} \x1b[0m\n`,
      );
    });
  } catch (error) {
    console.error("Error starting the server: ", error);
    throw error;
  }
}

main();
