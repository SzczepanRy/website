const { resolve } = require("path");

module.exports = {
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, "./index.html"),
                hex: resolve(__dirname, "./3D.html"),
            },
        },
    },
};
