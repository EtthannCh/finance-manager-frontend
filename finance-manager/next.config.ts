import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env:{
    BACKEND_HOST: "http://localhost:8080"
  }
};

export default nextConfig;
