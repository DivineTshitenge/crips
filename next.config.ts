import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "path";
import { fileURLToPath } from "url";

/** Dossier du projet (évite que Turbopack prenne un parent qui a un autre package-lock.json) */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** Charge .env.local depuis ce dossier (pas seulement process.cwd(), souvent incorrect sous Windows) */
loadEnvConfig(projectRoot, process.env.NODE_ENV !== "production");

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
