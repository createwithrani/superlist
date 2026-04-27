/**
 * External dependencies
 */
import classnames from "classnames";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps, InnerBlocks, RichText } from "@wordpress/block-editor";

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
	const {
		listStyle,
		orientation,
		itemWidth,
		verticalAlignment,
		start,
		reversed,
		caption,
		customMarker,
	} = attributes;

	const isOrdered = listStyle === "ol";
	const showCaption = typeof caption === "string" && caption.length > 0;

	const listInlineStyle = {};
	if ("horizontal" === orientation) {
		listInlineStyle["--wp--custom--superlist-block--list-settings--width"] = itemWidth;
	}
	if (customMarker) {
		listInlineStyle["--superlist-marker"] = `"${customMarker}"`;
	}

	const listClasses = classnames(listStyle, orientation, {
		[`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
		"has-custom-marker": !!customMarker,
	});

	const ListContainer = "none" !== listStyle ? listStyle : "ul";

	const containerExtraProps = isOrdered
		? {
				...(typeof start === "number" ? { start } : {}),
				...(reversed ? { reversed: true } : {}),
		  }
		: {};

	if (showCaption) {
		return (
			<figure {...useBlockProps.save({ className: "has-caption" })}>
				<RichText.Content
					tagName="figcaption"
					className="wp-block-createwithrani-superlist-block__caption"
					value={caption}
				/>
				<ListContainer
					className={classnames(
						"wp-block-createwithrani-superlist-block__list",
						listClasses
					)}
					style={listInlineStyle}
					{...containerExtraProps}
				>
					<InnerBlocks.Content />
				</ListContainer>
			</figure>
		);
	}

	return (
		<ListContainer
			{...useBlockProps.save({
				className: listClasses,
				style: listInlineStyle,
			})}
			{...containerExtraProps}
		>
			<InnerBlocks.Content />
		</ListContainer>
	);
}
