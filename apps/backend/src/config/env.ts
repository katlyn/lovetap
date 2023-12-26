import { secret, strictVerify, transform } from "env-verifier"

// This object contains any default values that we want to be present in the environment. This is good for defining
// default ports, hostnames, or similar. All values must be a string.
export const defaults: Record<string, string> = {
  HTTP_HOST: "0.0.0.0",
  HTTP_PORT: "8080",
  HTTP_TRUST_PROXY: "false",
  NODE_ENV: "development",
  DATABASE_PATH: "/data/lovetap.db"
}

export const config = {
  environment: "NODE_ENV",
  database: {
    path: "DATABASE_PATH"
  },
  http: {
    host: "HTTP_HOST",
    port: transform("HTTP_PORT", Number),
    proxyTrust: "HTTP_TRUST_PROXY"
  },
  vapid: {
    subject: "VAPID_SUBJECT",
    public: "VAPID_PUBLIC_KEY",
    private: "VAPID_PRIVATE_KEY"
  }
}

const env = strictVerify<typeof config>(config, {...defaults, ...process.env})
export default env
