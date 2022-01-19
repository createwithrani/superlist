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
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
	store as blockEditorStore,
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

const LISTITEM_TEMPLATE = [["core/paragraph"]];
/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit(props) {
	const { clientId } = props;
	const { hasInnerBlocks } = useSelect(
		(select) => {
			const { getBlock } = select(blockEditorStore);
			const block = getBlock(clientId);
			return {
				hasInnerBlocks: !!(block && block.innerBlocks.length),
			};
		},
		[clientId]
	);
	const blockProps = useBlockProps({});
	const innerBlockProps = useInnerBlocksProps(blockProps, {
		// template: LISTITEM_TEMPLATE,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
		templateInsertUpdateSelection: true,
	});
	return (
		<>
			<BlockControls></BlockControls>
			<li {...innerBlockProps} />
		</>
	);
}
