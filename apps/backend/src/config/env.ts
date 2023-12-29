import { secret, strictVerify, transform } from "env-verifier"

// This object contains any default values that we want to be present in the environment. This is good for defining
// default ports, hostnames, or similar. All values must be a string.
export const defaults: Record<string, string> = {
  HTTP_HOST: "0.0.0.0",
  HTTP_PORT: "8080",
  HTTP_TRUST_PROXY: "false",
  NODE_ENV: "development"
}

export const config = {
  environment: "NODE_ENV",
  database: {
    url: "DATABASE_URL"
  },
  http: {
    corsUrl: "HTTP_CORS_URL",
    host: "HTTP_HOST",
    port: transform("HTTP_PORT", Number),
    trustProxy: transform("HTTP_TRUST_PROXY", v => {
      if (v.toLowerCase() === "true") {
        return true
      }
      const parsed = Number(v)
      if (!isNaN(parsed)) {
        return parsed
      }
      if (v.includes(".") || v.includes(":")) {
        return v.split(",").map(s => s.trim())
      }
      return false
    })
  },
  vapid: {
    subject: "VAPID_SUBJECT",
    public: "VAPID_PUBLIC_KEY",
    private: "VAPID_PRIVATE_KEY"
  }
}

const env = strictVerify<typeof config>(config, {...defaults, ...process.env})
export default env
