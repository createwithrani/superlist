/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import {
	useBlockProps,
	InnerBlocks,
	BlockControls,
	// __experimentalUseInnerBlocksProps as useInnerBlocksProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from "@wordpress/block-editor";
import { Toolbar, ToolbarButton } from "@wordpress/components";
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";
import ListStyleUI from "./list-style";

/**
 * Internal Dependencies
 */
import { name as allowedBlock } from "../superlist-item";
const ALLOWED_BLOCKS = [allowedBlock];
const LIST_TEMPLATE = [
	["createwithrani/superlist-item"],
	["createwithrani/superlist-item"],
];

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { listStyle } = attributes;
	const blockProps = useBlockProps({ className: listStyle });
	const innerBlockProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: LIST_TEMPLATE,
		templateInsertUpdateSelection: true,
	});
	function switchStyle(style) {
		setAttributes({ listStyle: style });
	}
	const ListContainer = "none" !== listStyle ? listStyle : "ul";
	return (
		<>
			<BlockControls>
				<ListStyleUI value={listStyle} onChange={switchStyle} />
			</BlockControls>
			<ListContainer {...innerBlockProps} />
		</>
	);
}
