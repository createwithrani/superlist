/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./style.scss";

/**
 * Internal dependencies
 */
import metadata from "./block.json";
import edit from "./edit";
import save from "./save";
import example from "./example/example";
import transforms from "./transforms";
import { SuperList as icon } from "./icons";

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType("createwithrani/superlist-block", {
	/**
	 * Pulling the metadata in just in case something weird happens with client-side installation through the Block Library search again.
	 */
	...metadata,
	icon,
	edit,
	save,
	example,
	transforms,
});
