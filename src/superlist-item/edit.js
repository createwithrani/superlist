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
import { ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { getBlockType, createBlock } from "@wordpress/blocks";
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
	const { clientId, name, isSelected } = props;
	const { selectBlock, toggleBlockHighlight } = useDispatch(blockEditorStore);
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
	const { parentBlockType, firstParentClientId, settings } = useSelect(
		(select) => {
			const {
				getBlockName,
				getBlockParents,
				getSelectedBlockClientId,
				getSettings,
			} = select(blockEditorStore);
			const selectedBlockClientId = getSelectedBlockClientId();
			const parents = getBlockParents(selectedBlockClientId);
			const _firstParentClientId = parents[parents.length - 1];
			const parentBlockName = getBlockName(_firstParentClientId);
			const _parentBlockType = getBlockType(parentBlockName);
			const settings = getSettings();
			return {
				parentBlockType: _parentBlockType,
				firstParentClientId: _firstParentClientId,
				settings: settings,
			};
		},
		[]
	);

	const blockProps = useBlockProps({});
	const { insertBlock } = useDispatch("core/block-editor");
	const { parentinnerBlocks } = useSelect((select) => ({
		parentinnerBlocks: select("core/block-editor").getBlocks(
			firstParentClientId
		),
	}));

	function getCurrentBlockPosition(block) {
		return block.clientId === clientId;
	}
	const insertListItem = () => {
		const block = createBlock(name);
		insertBlock(
			block,
			parentinnerBlocks.findIndex(getCurrentBlockPosition) + 1,
			firstParentClientId
		);
	};
	const innerBlockProps = useInnerBlocksProps(blockProps, {
		template: LISTITEM_TEMPLATE,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	});
	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						className="block-editor-block-parent-selector__button"
						onClick={() => selectBlock(firstParentClientId)}
						label={sprintf(
							/* translators: %s: Settings of the block's parent. */
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
