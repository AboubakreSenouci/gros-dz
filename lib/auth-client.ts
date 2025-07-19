import { createAuthClient } from "better-auth/react";
import { customSessionClient, phoneNumberClient } from "better-auth/client/plugins"
import { auth } from "./auth";

export const authClient = createAuthClient({
    // baseURL: "http://localhost:3000",
    plugins: [
        phoneNumberClient(),
        customSessionClient<typeof auth>(),
    ]
});
