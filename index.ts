import { createServer } from "node:http";
import { createApplication } from "@/app/index.js";
import { env } from "@/env/index.js";

function main() {
  try {
    const server = createServer(createApplication());

    server.listen(env.PORT, () => {
      console.log(`Http server is running on PORT ${env.PORT}`);
    });
  } catch (error) {
    console.log(`Error starting http server`);
    throw error;
  }
}

main();
