import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
    base: "https://localhost:7198",
    // client: "axios", // Lỗi: 'client' does not exist in type 'Configs'
    input: "https://localhost:7198/swagger/v1.0/swagger.json",
    output: {
        lint: "eslint",
        format: "prettier",
        path: "./src/api/user",
    },
    // types: {
    //     enums: "typescript",
    // },
});
