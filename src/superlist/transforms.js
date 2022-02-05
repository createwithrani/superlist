/**
 * Block Transforms.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-transforms/
 */

import { createBlock } from "@wordpress/blocks";
import {
	create,
	split,
	toHTMLString,
} from "@wordpress/rich-text";

// TODO: replace with LINE_SEPARATOR from @wordpress/rich-text when it is no longer unstable (__UNSTABLE_LINE_SEPARATOR).
const LINE_SEPARATOR = "\u2028";

export const transforms = {
	from: [
		{
			type: "block",
			blocks: [ "core/list" ],
			transform: ( { ordered, values, ...rest } ) => {
				/**
				 * Mostly borrowed from core/list transform to core/paragraph.
				 *
				 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/list/transforms.js
				 */
				const innerBlocks = split(
					create( {
						html: values,
						multilineTag: "li",
						multilineWrapperTags: [ "ul", "ol" ],
					} ),
					LINE_SEPARATOR
				).map( ( piece ) =>
					/**
					 * For each list item, create a superlist-item with a nested
					 * core/paragraph with the item content.
					 */
					createBlock(
						"createwithrani/superlist-item",
						{},
						[
							createBlock( 'core/paragraph', {
								content: toHTMLString( { value: piece } ),
							} )
						]
					)
				);

				return createBlock(
					"createwithrani/superlist-block",
					{
						listStyle: ordered ? 'ol' : 'ul',
						/**
						 * Apply the rest of the original list attribtues to the
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
