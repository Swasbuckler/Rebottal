import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.dirname(path.dirname(__dirname)),
};

export default nextConfig;
