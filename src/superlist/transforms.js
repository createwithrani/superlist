/**
 * Block Transforms.
 *
 * Modern @wordpress/block-library/list stores list items as nested
 * core/list-item blocks (and recursively nested core/list blocks for
 * sub-lists). The previous transform read a now-removed `values` HTML
 * string attribute and is no longer compatible.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-transforms/
 */

import { createBlock } from "@wordpress/blocks";

/**
 * Convert a tree of core/list (with nested core/list-item / core/list)
 * innerBlocks into the equivalent superlist-block / superlist-item tree.
 *
 * @param {Object[]} blocks Array of core/list-item innerBlocks.
 * @return {Object[]} Array of superlist-item blocks.
 */
function listItemsToSuperItems(blocks) {
	const result = [];
	for (const block of blocks) {
		if (!block || !block.name) continue;

		if (block.name === "core/list-item") {
			const inner = [];
			const { content } = block.attributes || {};
			if (content && content !== "") {
				inner.push(
					createBlock("core/paragraph", { content })
				);
			}
			// A list-item may itself contain a nested core/list (for sub-lists).
			for (const child of block.innerBlocks || []) {
				if (child.name === "core/list") {
					inner.push(coreListToSuperList(child));
				} else {
					// Anything else: keep as-is.
					inner.push(
						createBlock(child.name, child.attributes, child.innerBlocks)
					);
				}
			}
			result.push(
				createBlock("createwithrani/superlist-item", {}, inner)
			);
		} else if (block.name === "core/list") {
			// A loose core/list directly inside another list — preserve as a
			// nested superlist by wrapping in a single superlist-item.
			result.push(
				createBlock(
					"createwithrani/superlist-item",
					{},
					[coreListToSuperList(block)]
				)
			);
		}
	}
	return result;
}

/**
 * Convert a single core/list block (with attributes + innerBlocks) into a
 * superlist-block.
 *
 * @param {Object} listBlock core/list block object.
 * @return {Object} createwithrani/superlist-block block.
 */
function coreListToSuperList(listBlock) {
	const {
		ordered,
		start,
		reversed,
		...rest
	} = listBlock.attributes || {};
	const innerSuperItems = listItemsToSuperItems(listBlock.innerBlocks || []);
	return createBlock(
		"createwithrani/superlist-block",
		{
			listStyle: ordered ? "ol" : "ul",
			...(typeof start === "number" ? { start } : {}),
			...(reversed ? { reversed: true } : {}),
			// Preserve typography / color / etc. attributes from the source.
			...rest,
		},
		innerSuperItems
	);
}

/**
 * Extract a content string from a superlist-item by concatenating the text
 * content of any inner paragraph/heading blocks. Used by the to-core/list
 * transform, which is necessarily lossy (it can't preserve arbitrary nested
 * blocks inside a single list-item).
 *
 * @param {Object} item superlist-item block.
 * @return {string} Plain HTML content for the corresponding core/list-item.
 */
function superItemToListItemContent(item) {
	const parts = [];
	for (const inner of item.innerBlocks || []) {
		if (!inner || !inner.attributes) continue;
		const { content } = inner.attributes;
		if (content && content !== "") {
			parts.push(typeof content === "string" ? content : content.toString());
		}
	}
	return parts.join("<br>");
}

/**
 * Recursively convert a superlist-block into a core/list block (with nested
 * core/list-item and core/list blocks for sub-lists).
 *
 * @param {Object} superBlock createwithrani/superlist-block block.
 * @return {Object} core/list block.
 */
function superListToCoreList(superBlock) {
	// `orientation` and `itemWidth` are deliberately discarded — they have no
	// equivalent on core/list. The rest pass through (color, typography, etc.).
	const {
		listStyle,
		start,
		reversed,
		// eslint-disable-next-line no-unused-vars
		orientation,
		// eslint-disable-next-line no-unused-vars
		itemWidth,
		...rest
	} = superBlock.attributes || {};

	const listItems = [];
	for (const item of superBlock.innerBlocks || []) {
		if (!item || item.name !== "createwithrani/superlist-item") continue;

		// Promote any nested superlist-block inside this item into a nested
		// core/list child of the corresponding core/list-item.
		const nestedLists = (item.innerBlocks || [])
			.filter((b) => b.name === "createwithrani/superlist-block")
			.map((b) => superListToCoreList(b));

		listItems.push(
			createBlock(
				"core/list-item",
				{ content: superItemToListItemContent(item) },
				nestedLists
			)
		);
	}

	return createBlock(
		"core/list",
		{
			ordered: listStyle === "ol",
			...(typeof start === "number" ? { start } : {}),
			...(reversed ? { reversed: true } : {}),
			// Pass through generic attributes (typography, color, etc.) that
			// both blocks support; orientation/itemWidth are dropped because
			// core/list has no equivalent.
			...rest,
		},
		listItems
	);
}

const Transforms = {
	from: [
		{
			type: "block",
			blocks: ["core/list"],
			transform: (attributes, innerBlocks) =>
				coreListToSuperList({
					attributes,
					innerBlocks: innerBlocks || [],
				}),
		},
	],
	to: [
		{
			type: "block",
			blocks: ["core/list"],
			transform: (attributes, innerBlocks) =>
				superListToCoreList({
					attributes,
					innerBlocks: innerBlocks || [],
				}),
		},
	],
};

export default Transforms;
