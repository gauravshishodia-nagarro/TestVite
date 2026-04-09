import react from "@vitejs/plugin-react";
import babel from "vite-plugin-babel";
import { InlineConfig, loadEnv, transformWithEsbuild } from "vite";
import commonjs from "vite-plugin-commonjs";
// @ts-expect-error no types
import { esbuildFlowPlugin, flowPlugin } from "@bunchtogether/vite-plugin-flow";
import { defineConfig } from "vite";
import reactNativeWeb from "vite-plugin-react-native-web";
import { viteCommonjs, esbuildCommonjs } from "@originjs/vite-plugin-commonjs";

const extensions = [
  ".web.js",
  ".web.ts",
  ".web.tsx",
  ".web.mjs",
  ".web.cjs",
  ".js",
  ".jsx",
  ".json",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
];

const exclude = /\/node_modules\/(?!react-native|@react-native|expo|@expo)/;

export default defineConfig(({ mode }) => {
  // Load all .env vars regardless of prefix
  const env = loadEnv(mode, process.cwd(), "");

  return {
  base: "./",
  define: {
    // yeah weird I know
    global: "window",
    DEV: JSON.stringify(process.env.NODE_ENV === "development"),
    // don't even remember anymore
    "global.__x": {},
    // reanimated stuff
    _frameTimestamp: undefined,
    // reanimated stuff
    _WORKLET: false,
    // expected by most react native code
    __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    // expected by some expo libraries
    EXPO_OS: JSON.stringify("web"),
    "process.env.EXPO_OS": JSON.stringify("web"),
    // something in reanimated seemed to need this
    "global.Error": "Error",
    // Expose .env vars to the browser bundle
    "process.env.EXPO_PUBLIC_UAT_BASE_URL": JSON.stringify(env.EXPO_PUBLIC_UAT_BASE_URL),
    "process.env.EXPO_PUBLIC_PAYFORT_UAT_ACCESS_CODE": JSON.stringify(env.EXPO_PUBLIC_PAYFORT_UAT_ACCESS_CODE),
    "process.env.EXPO_PUBLIC_PAYFORT_DEV_MERCHANT_IDENTIFIER": JSON.stringify(env.EXPO_PUBLIC_PAYFORT_DEV_MERCHANT_IDENTIFIER),
    "process.env.EXPO_PUBLIC_PAYFORT_UAT_SHA_REQUEST": JSON.stringify(env.EXPO_PUBLIC_PAYFORT_UAT_SHA_REQUEST),
  },
  esbuild: {
    jsx: "automatic",
  },
  optimizeDeps: {
    include: [
      "@react-navigation/native",
      "react-native-reanimated",
      "nativewind",
      "react-native-css-interop",
    ],
    esbuildOptions: {
      jsx: "automatic",
      mainFields: ["module", "main"],
      resolveExtensions: extensions,
      loader: {
        ".js": "jsx",
      },
      plugins: [
        esbuildCommonjs(["@react-navigation/native-stack"]),
        esbuildFlowPlugin(
          new RegExp(/\.(flow|jsx?)$/),
          (_path: string) => "jsx"
        ),
      ],
    },
  },
  resolve: {
    extensions,
    alias: {
      "react-native": "react-native-web",
    },
  },
  plugins: [
    flowPlugin({
      exclude,
    }),
    {
      name: "treat-js-files-as-jsx",
      async transform(code, id) {
        if (!id.match(/\.js$/)) return null;
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    commonjs(),
    viteCommonjs(),
    react({
      jsxRuntime: "automatic",
      jsxImportSource: "nativewind",
      babel: {
        babelrc: false,
        configFile: false,
        plugins: ["react-native-worklets/plugin"],
      },
    }),
    reactNativeWeb({
      jsxRuntime: "automatic",
      jsxImportSource: "nativewind",
    }),
    // handles node modules code
    babel({
      include: [
        // include the modules you want to transpile here
        /node_modules\/(react-native|@react-native|expo|@expo)/,
      ],
      babelConfig: {
        babelrc: false,
        configFile: false,
        presets: [
          [
            "@babel/preset-react",
            {
              development: process.env.NODE_ENV === "development",
              runtime: "automatic",
            },
          ],
        ],
        plugins: [
          [
            // this is a fix for reanimated not working in production
            "@babel/plugin-transform-modules-commonjs",
            {
              strict: false,
              strictMode: false, // prevent "use strict" injections
              allowTopLevelThis: true, // dont rewrite global `this` -> `undefined`
            },
          ],
        ],
      },
    }),
  ],
  assetsInclude: ["**/*.woff2", "**/*.woff"],
  server: {
    port: 3000,
    fs: {
      strict: false,
    },
  },
  publicDir: "public",
  } satisfies InlineConfig;
});
