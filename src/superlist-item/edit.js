/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __, sprintf } from "@wordpress/i18n";

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
	InspectorControls,
	useInnerBlocksProps,
	store as blockEditorStore,
} from "@wordpress/block-editor";
import {
	ToolbarButton,
	ToolbarGroup,
	PanelBody,
	PanelRow,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { createBlock, store as blocksStore } from "@wordpress/blocks";
import { plusCircle } from "@wordpress/icons";
import { useCallback } from "@wordpress/element";

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
	const { insertBlock, selectBlock, removeBlock, updateBlockAttributes } =
		useDispatch(blockEditorStore);

	const {
		parentBlock,
		parentClientId,
		parentBlockType,
		parentItemWidth,
		parentOrientation,
		hasInnerBlocks,
		innerBlocks,
		selectedBlockClientId,
	} = useSelect(
		(select) => {
			const store = select(blockEditorStore);
			const blocks = select(blocksStore);

			const parents = store.getBlockParentsByBlockName(
				clientId,
				"createwithrani/superlist-block"
			);
			const parentId = parents[0];
			const parent = parentId ? store.getBlock(parentId) : null;
			const parentType = blocks.getBlockType(
				parent ? parent.name : ""
			);
			const block = store.getBlock(clientId);

			return {
				parentClientId: parentId,
				parentBlock: parent,
				parentBlockType: parentType,
				parentItemWidth: parent ? parent.attributes.itemWidth : undefined,
				parentOrientation: parent ? parent.attributes.orientation : undefined,
				hasInnerBlocks: !!(block && block.innerBlocks.length),
				innerBlocks: block ? block.innerBlocks : [],
				selectedBlockClientId: store.getSelectedBlockClientId(),
			};
		},
		[clientId]
	);

	// Insert a new list item block after the current block. The toolbar "Add"
	// button leaves the new item empty (matching core's list behavior); the
	// double-enter shortcut prefills it with an empty paragraph so the cursor
	// has somewhere to land for typing.
	const insertListItem = useCallback(
		({ withParagraph = false } = {}) => {
			if (!parentBlock || !parentClientId) {
				return null;
			}
			const inner = withParagraph ? [createBlock("core/paragraph")] : [];
			const newListItem = createBlock(name, {}, inner);

			const currentIndex = parentBlock.innerBlocks.findIndex(
				(block) => block.clientId === clientId
			);
			const insertIndex =
				currentIndex === -1
					? parentBlock.innerBlocks.length
					: currentIndex + 1;
			insertBlock(newListItem, insertIndex, parentClientId);
			return newListItem.clientId;
		},
		[parentBlock, parentClientId, clientId, name, insertBlock]
	);

	const blockProps = useBlockProps({
		// When the user presses Enter inside an empty trailing paragraph of
		// this list-item, escape out and start a new list-item. The first
		// Enter (in a non-empty paragraph) splits the paragraph as usual; the
		// second Enter — now in the resulting empty paragraph — fires this.
		onKeyDown: (event) => {
			if (
				event.key !== "Enter" ||
				event.shiftKey ||
				event.metaKey ||
				event.ctrlKey ||
				event.isDefaultPrevented()
			) {
				return;
			}
			if (!innerBlocks || innerBlocks.length === 0) {
				return;
			}

			const lastChild = innerBlocks[innerBlocks.length - 1];
			if (
				!lastChild ||
				lastChild.name !== "core/paragraph" ||
				lastChild.clientId !== selectedBlockClientId
			) {
				return;
			}

			const content = lastChild.attributes && lastChild.attributes.content;
			const contentString =
				content == null
					? ""
					: typeof content === "string"
						? content
						: typeof content.toString === "function"
							? content.toString()
							: "";

			if (contentString.replace(/<br\s*\/?>/gi, "").trim() !== "") {
				return;
			}

			event.preventDefault();
			removeBlock(lastChild.clientId, false);
			insertListItem({ withParagraph: true });
		},
	});

	const innerBlockProps = useInnerBlocksProps(blockProps, {
		templateInsertUpdateSelection: true,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	});

	const updateParentItemWidth = useCallback(
		(value) => {
			if (parentClientId) {
				updateBlockAttributes(parentClientId, { itemWidth: value });
			}
		},
		[parentClientId, updateBlockAttributes]
	);

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
						onClick={() => insertListItem()}
						icon={plusCircle}
						label={__("Add another list item", "superlist-block")}
					/>
				</ToolbarGroup>
			</BlockControls>
			{parentOrientation === "horizontal" && (
				<InspectorControls>
					<PanelBody
						title={__("List Settings", "superlist-block")}
						initialOpen={true}
					>
						<PanelRow>
							<UnitControl
								label={__("List-item max-width", "superlist-block")}
								help={__(
									"Applies to all items in this list.",
									"superlist-block"
								)}
								value={parentItemWidth || ""}
								onChange={updateParentItemWidth}
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
			)}
			<li {...innerBlockProps} />
		</>
	);
}
