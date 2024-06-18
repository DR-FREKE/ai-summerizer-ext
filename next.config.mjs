/** @type {import('next').NextConfig} */
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve("src/extension/manifest.json"),
              to: "./dist",
            },
          ],
        })
      );
    }

    config.resolve.extensions.push(".ts", ".tsx");

    return config;
  },
};

export default nextConfig;
