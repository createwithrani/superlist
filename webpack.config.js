const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
	...defaultConfig,
	entry: {
		"superlist-item": "./src/superlist-item/index.js",
		superlist: "./src/superlist/index.js",
	},
};
