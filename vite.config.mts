import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import nodecg from "./vite-plugin-nodecg.mjs";
import rollupEsbuild from "rollup-plugin-esbuild";
import rollupExternals from "rollup-plugin-node-externals";

export default defineConfig({
	server: {
	  host: '0.0.0.0',
	  port: 8080
	},
	clearScreen: false,
	plugins: [
		react(),
		nodecg({
			bundleName: "nodecgbundletemplate",
			graphics: "./src/browser/graphics/views/*.tsx",
			dashboard: "./src/browser/dashboard/views/*.tsx",
			extension: {
				input: "./src/extension/index.ts",
				plugins: [rollupEsbuild(), rollupExternals()],
			},
		}),
	],
});
