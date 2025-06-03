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
	useInnerBlocksProps,
	store as blockEditorStore,
} from "@wordpress/block-editor";
import { ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { createBlock, store as blocksStore } from "@wordpress/blocks";
import { plusCircle } from "@wordpress/icons";

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
	const { clientId, name } = props;
	const { insertBlock, selectBlock } = useDispatch("core/block-editor");
	const { parentBlock, parentClientId, parentBlockType, hasInnerBlocks } = useSelect((select) => {
		const parentClientId = select(blockEditorStore).getBlockParentsByBlockName(
			clientId,
			"createwithrani/superlist-block",
		)[0];
		const parentBlock = select(blockEditorStore).getBlock(parentClientId);
		const parentBlockType = select(blocksStore).getBlockType(
			parentBlock ? parentBlock.name : "",
		);
		const { getBlock } = select(blockEditorStore);
			const block = getBlock(clientId);
		return {
			parentClientId,
			parentBlock,
			parentBlockType,
			hasInnerBlocks: !!(block && block.innerBlocks.length),
		};
	}, [clientId, name]);

	// set up block properties and inner blocks settings
	const blockProps = useBlockProps({});
	const innerBlockProps = useInnerBlocksProps(blockProps, {
		templateInsertUpdateSelection: true,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	});

	// Insert a new list item block after the current block
	const insertListItem = () => {
		const newListItem = createBlock(name);

		// Get the index of the current block in the parent block's inner blocks
		const currentIndex = parentBlock.innerBlocks.findIndex(
			(block) => block.clientId === clientId,
		);

		// Insert the new list item block after the current block
		const insertIndex = currentIndex === -1 ? parentBlock.innerBlocks.length : currentIndex + 1;
		insertBlock(newListItem, insertIndex, parentClientId);
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						className="block-editor-block-parent-selector__button"
						onClick={() => selectBlock(parentClientId)}
						label={sprintf(
							/* translators: %s: Settings of the block's parent Super List. */
							__(" %s Settings", "superlist-block"),
							parentBlockType ? parentBlockType.title : ""
						)}
						showTooltip
					>
						{__("Settings", "superlist-block")}
					</ToolbarButton>
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarButton
						onClick={insertListItem}
						icon={plusCircle}
						label={__("Add another list item", "superlist-block")}
					/>
				</ToolbarGroup>
			</BlockControls>
			<li {...innerBlockProps} />
		</>
	);
}
