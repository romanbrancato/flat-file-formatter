import webpack from "webpack";

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, options) => {
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
                resource.request = resource.request.replace(/^node:/, "");
            })
        );
        return config;
    },
    transpilePackages: [
        '@electric-sql/pglite-react',
        '@electric-sql/pglite',
        '@electric-sql/pglite-repl'
    ],
    reactStrictMode: false
};

export default nextConfig;
