import { createServer } from "node:http";
import { createApplication } from "./app/index.js";

function main() {
  try {
    const server = createServer(createApplication());
    const PORT: number = 8080; // TODO: get from env variable

    server.listen(PORT, () => {
      console.log(`Http server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.log(`Error starting http server`);
    throw error;
  }
}

main();
