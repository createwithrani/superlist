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
import {
	useBlockProps,
	BlockControls,
	useInnerBlocksProps,
	InspectorControls,
	useSettings,
	BlockVerticalAlignmentToolbar,
	RichText,
} from "@wordpress/block-editor";
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	TextControl,
	__experimentalNumberControl as NumberControl,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { useState, useCallback } from "@wordpress/element";

/**
 * Internal Dependencies
 */
import ListStyleUI from "./list-style";
import Orientation from "./orientation";
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

/**
 * Constants
 */
const ALLOWED_BLOCKS = ["createwithrani/superlist-item"];
const LIST_TEMPLATE = [
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

	// check if theme.json has set a preferred list orientation
	const [themeListOrientation] = useSettings(
		"custom.superlist-block.listSettings.orientation"
	);

	// set the default list orientation to theme.json preference but if there's no theme.json preference, set it to vertical
	const defaultListOrientation =
		undefined === themeListOrientation ? "vertical" : themeListOrientation;

	// set up a state variable for list orientation, use the orientation attribute if it is set, otherwise use the smart default
	const [listOrientation, setListOrientation] = useState(
		undefined !== orientation ? orientation : defaultListOrientation
	);

	// set state for list item width from the attribute
	const [width, setWidth] = useState(itemWidth);

	const isOrdered = listStyle === "ol";
	const showCaption =
		typeof caption === "string" && caption.length > 0;

	// Inline style applied to the list element (not the figure wrapper).
	const listInlineStyle = {};
	if ("horizontal" === listOrientation) {
		listInlineStyle["--wp--custom--superlist-block--list-settings--width"] = width;
	}
	if (customMarker) {
		listInlineStyle["--superlist-marker"] = `"${customMarker}"`;
	}

	const listClasses = classnames(listStyle, listOrientation, {
		[`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
		"has-custom-marker": !!customMarker,
	});

	// useBlockProps applies to the outermost element. In caption mode that's
	// the <figure>; otherwise it's the list itself.
	const blockProps = useBlockProps({
		className: showCaption
			? "has-caption"
			: listClasses,
		style: showCaption ? undefined : listInlineStyle,
	});

	// useInnerBlocksProps wires the inner-blocks behavior to a wrapper element.
	// In caption mode the list is a separate element (not the block wrapper);
	// otherwise it IS the block wrapper, so we extend blockProps.
	const innerBlockProps = useInnerBlocksProps(
		showCaption
			? {
					className: classnames(
						"wp-block-createwithrani-superlist-block__list",
						listClasses
					),
					style: listInlineStyle,
			  }
			: blockProps,
		{
			allowedBlocks: ALLOWED_BLOCKS,
			template: LIST_TEMPLATE,
			orientation: `${listOrientation}`,
			templateInsertUpdateSelection: true,
		}
	);

	/**
	 * onChange function to switch the list style
	 * @param {string} style ul || ol || none
	 */
	const switchStyle = useCallback(
		(style) => {
			const next = { listStyle: style };
			// Reset ordered-list-only attributes when switching away from ol so
			// they don't silently affect a future <ol> conversion.
			if (style !== "ol") {
				next.start = undefined;
				next.reversed = undefined;
			}
			setAttributes(next);
		},
		[setAttributes]
	);

	/**
	 * onChange function to set the user inputted item width including unit
	 * @param {string} value
	 */
	function setItemWidth(value) {
		setWidth(value);
		setAttributes({ itemWidth: value });
	}

	/**
	 * onChange function to set the vertical alignment attribute
	 */
	function updateAlignment(nextVerticalAlignment) {
		setAttributes({ verticalAlignment: nextVerticalAlignment });
	}

	/**
	 * onChange function to update the list orientation
	 * @param {string} nextOrientation horizontal || vertical
	 */
	function updateOrientation(nextOrientation) {
		setListOrientation(nextOrientation);
		setAttributes({ orientation: nextOrientation });
	}

	/**
	 * Set container tag name based on list style. When markers are off we still
	 * use a <ul> so the structure stays semantic.
	 */
	const ListContainer = "none" !== listStyle ? listStyle : "ul";

	const containerExtraProps = isOrdered
		? {
				...(typeof start === "number" ? { start } : {}),
				...(reversed ? { reversed: true } : {}),
		  }
		: {};

	const listElement = (
		<ListContainer {...innerBlockProps} {...containerExtraProps} />
	);

	return (
		<>
			<BlockControls>
				<BlockVerticalAlignmentToolbar
					onChange={updateAlignment}
					value={verticalAlignment}
				/>
				<ListStyleUI
					value={listStyle}
					onChange={switchStyle}
					placement="toolbar"
				/>
				<Orientation
					listOrientation={listOrientation}
					updateOrientation={updateOrientation}
					placement="toolbar"
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					initialOpen={true}
					title={__("List Settings", "superlist-block")}
				>
					<PanelRow>
						<ListStyleUI
							value={listStyle}
							onChange={switchStyle}
							placement="inspector"
							describedBy={__("Change list type", "superlist-block")}
						/>
					</PanelRow>
					<PanelRow>
						<Orientation
							listOrientation={listOrientation}
							updateOrientation={updateOrientation}
							placement="inspector"
						/>
					</PanelRow>
					{listOrientation === "horizontal" && (
						<PanelRow>
							<UnitControl
								label={__("List-item max-width", "superlist-block")}
								onChange={setItemWidth}
								value={width}
							/>
						</PanelRow>
					)}
					{isOrdered && (
						<>
							<PanelRow>
								<NumberControl
									label={__("Start value", "superlist-block")}
									value={typeof start === "number" ? start : ""}
									min={1}
									onChange={(value) => {
										if (value === "" || value === undefined) {
											setAttributes({ start: undefined });
											return;
										}
										const parsed = parseInt(value, 10);
										setAttributes({
											start: Number.isNaN(parsed) ? undefined : parsed,
										});
									}}
								/>
							</PanelRow>
							<PanelRow>
								<ToggleControl
									label={__("Reverse list numbering", "superlist-block")}
									checked={!!reversed}
									onChange={(value) => setAttributes({ reversed: value })}
								/>
							</PanelRow>
						</>
					)}
					{listStyle === "ul" && (
						<PanelRow>
							<TextControl
								label={__("Custom marker", "superlist-block")}
								help={__(
									"Optional. A character or emoji used as the list marker (e.g. ★, →, •). Leave blank to use the default bullet.",
									"superlist-block"
								)}
								value={customMarker || ""}
								onChange={(value) =>
									setAttributes({ customMarker: value || undefined })
								}
							/>
						</PanelRow>
					)}
				</PanelBody>
				<PanelBody
					initialOpen={false}
					title={__("List Title", "superlist-block")}
				>
					<PanelRow>
						<TextControl
							label={__("Caption", "superlist-block")}
							help={__(
								"When set, the list is wrapped in a <figure> with this caption as <figcaption>.",
								"superlist-block"
							)}
							value={caption || ""}
							onChange={(value) =>
								setAttributes({ caption: value || undefined })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			{showCaption ? (
				<figure {...blockProps}>
					<RichText
						tagName="figcaption"
						className="wp-block-createwithrani-superlist-block__caption"
						value={caption || ""}
						onChange={(value) => setAttributes({ caption: value })}
						placeholder={__("Add a list title…", "superlist-block")}
						aria-label={__("List title", "superlist-block")}
					/>
					{listElement}
				</figure>
			) : (
				listElement
			)}
		</>
	);
}
