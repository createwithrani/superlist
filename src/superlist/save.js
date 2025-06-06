/**
 * External dependencies
 */
import classnames from "classnames";
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
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save({ attributes }) {
	const { listStyle, orientation, itemWidth, verticalAlignment } = attributes;
	const subItemWidth = {
		gridTemplateColumns: `repeat(auto-fill, minmax(${itemWidth}, 1fr))`,
	};
	const ListContainer = "none" !== listStyle ? listStyle : "ul";
	return (
		<ListContainer
			{...useBlockProps.save({
				className: classnames(listStyle, orientation, {
					[`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
				}),
				style: "horizontal" === orientation ? subItemWidth : {},
			})}
		>
			<InnerBlocks.Content />
		</ListContainer>
	);
}
