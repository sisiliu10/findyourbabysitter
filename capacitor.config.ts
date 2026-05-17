import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.tottilotti.app",
  appName: "tottilotti",
  webDir: "out",
  server: {
    url: "https://tottilotti.com",
    cleartext: false,
  },
};

export default config;
