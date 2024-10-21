import * as webpack from "webpack";
import * as path from "path";
import fs from "fs";

import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf-8"));

module.exports = () => {
    const devConfig = {
        mode: "development",

        devtool: "inline-source-map",

        devServer: {
            open: true,
            client: {
                overlay: {
                    warnings: false,
                    errors: true,
                },
            },
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },

        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].js",
        },

        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css",
            }),

            new ESLintPlugin({
                extensions: ["js", "jsx", "ts", "tsx"],
                emitError: true,
                emitWarning: false,
                failOnError: false,
                failOnWarning: false,
            }),

            new webpack.DefinePlugin({
                VERSION: JSON.stringify(pkg.version + "-d"),
            }),
        ],
    };

    return devConfig;
};
