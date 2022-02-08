/**
 * Block Transforms.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-transforms/
 */

import { createBlock } from "@wordpress/blocks";

// TODO: replace with LINE_SEPARATOR from @wordpress/rich-text when it is no longer unstable (__UNSTABLE_LINE_SEPARATOR).
const LINE_SEPARATOR = "\u2028";

export const transforms = {
	from: [
		{
			type: "block",
			blocks: [ "core/list" ],
			transform: ( { ordered, values, ...rest } ) => {
				// Parse list HTML string so we can natively traverse nested lists.
				const listDOM = new DOMParser().parseFromString(values, "text/html");
				const innerBlocks = nodeToInnerBlocks( listDOM.body ); // DOMParser creates an entire virtual document, the list elements are in `body`.

				return createBlock(
					"createwithrani/superlist-block",
					{
						listStyle: ordered ? "ol" : "ul",
						/**
						 * Apply the rest of the original list attributes to the
						 * super list (for typography settings, etc).
						 */
						...rest,
					},
					innerBlocks
				);
			},
		}
	],
};

/**
 * Recursively traverse child nodes and decide whether they can be stitched
 * together into a single core/paragraph block or if a superlist-block or
 * superlist-item with nested innerBlocks is output.
 *
 * @param {Node} parentNode Parent node to traverse child nodes.
 * @return {array} Array of InnerBlocks.
 */
function nodeToInnerBlocks(parentNode) {
	const nodes = parentNode.childNodes.values();

	const innerBlocks = [];
	let stitching = [];

	/**
	 * Combine the nodes in `stitching` as an HTML string, add to a paragraph
	 * block, and empty the array.
	 */
	const stitch = () => {
		if ( stitching.length ) {
			const content = stitching.map((n) =>
				n.nodeName === "#text"
					? n.nodeValue
					: n.outerHTML
			).join("");
			// Create a paragraph block with the HTML string as content.
			innerBlocks.push(
				createBlock(
					"core/paragraph",
					{ content }
				)
			);
			// Reset stitching.
			stitching = [];
		}
	}

	// Walk through child nodes and take action based on whether they are a list, list item, or anything else.
	for ( const node of nodes ) {
		switch( node.nodeName ) {
			case "LI":
			case "OL":
			case "UL":
				// If we've reached one of these elements, stitch together previous nodes in `stitching` and return a paragraph block.
				stitch();

				// Create either a superlist-block or a superlist-item, and recurse to create their innerBlocks.
				switch (node.nodeName) {
					case "OL":
					case "UL":
						innerBlocks.push(
							createBlock(
								"createwithrani/superlist-block",
								{
									listStyle: node.nodeName === "OL" ? "ol" : "ul",
								},
								nodeToInnerBlocks( node )
							)
						);
						break;
					case "LI":
						innerBlocks.push(
							createBlock(
								"createwithrani/superlist-item",
								{},
								nodeToInnerBlocks( node )
							)
						);
						break;
				}
				break;
			default:
				// Add non-LI/OL/UL nodes to `stitching` to combine as a single paragraph block.
				stitching.push(node);
				break;
		}
	}

	// Stitch together any lingering text nodes.
	stitch();

	return innerBlocks;
}
