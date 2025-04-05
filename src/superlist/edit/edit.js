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
	useSetting,
	BlockVerticalAlignmentToolbar,
} from "@wordpress/block-editor";
import {
	PanelBody,
	PanelRow,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { useState } from "@wordpress/element";

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
	const { listStyle, orientation, itemWidth, verticalAlignment } = attributes;

	// check if theme.json has set a preferred list orientation
	const themeListOrientation = useSetting(
		"custom.superlist-block.listSettings.orientation"
	);

	// set the default list orientation to theme.json preference but if there's no theme.json preference, set it to vertical
	const defaultListOrientation =
		undefined === themeListOrientation ? "vertical" : themeListOrientation;

	// set up a state variable for list orientation, use the orientation attribute if it is set, otherwise  use the smart default
	const [listOrientation, setListOrientation] = useState(
		undefined !== orientation ? orientation : defaultListOrientation
	);

	// set state for list item width from the attribute
	const [width, setWidth] = useState(itemWidth);

	// set inline CSS Custom Property for list item width
	const subItemWidth = {
		"--wp--custom--superlist-block--list-settings--width": width,
	};

	const blockProps = useBlockProps({
		// add class names to set list style, list orientation, and vertical alignment
		className: classnames(listStyle, listOrientation, {
			[`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
		}),
		// add inline style if list orientation is horizontal and the user has set a custom list item width
		style: "horizontal" === listOrientation ? subItemWidth : {},
	});

	const innerBlockProps = useInnerBlocksProps(blockProps, {
		// we only allow one kind of inner block, and we automatically populate this block with two inner blocks
		allowedBlocks: ALLOWED_BLOCKS,
		template: LIST_TEMPLATE,
		// we also set the inner block orientation based on the list orientation, this affects the in-between appender position
		orientation: `${listOrientation}`,
		// we also set the focus to newly added inner block when it's added
		templateInsertUpdateSelection: true,
	});

	/**
	 * onChange function to switch the list style
	 * @param {string} style ul || ol || none
	 */
	function switchStyle(style) {
		setAttributes({ listStyle: style });
	}

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
	 * @param {string} verticalAlignment
	 */
	function updateAlignment(verticalAlignment) {
		setAttributes({ verticalAlignment: verticalAlignment });
	}

	/**
	 * onChange function to update the list orientation
	 * @param {string} orientation horizontal || vertical
	 */
	function updateOrientation(orientation) {
		setListOrientation(orientation);
		setAttributes({ orientation: orientation });
	}

	/**
	 * Set container tag name based on list style, if the list style is none, set it to `ol`
	 */
	const ListContainer = "none" !== listStyle ? listStyle : "ol";

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
					{
						/**
						 * Only show list item setting if the list orientation is
						 * horizontal, because this setting is specifically for the basic
						 * grid mode this block offers.
						 */
						listOrientation === "horizontal" && (
							<PanelRow>
								<UnitControl
									label={__("List-item max-width", "superlist-block")}
									onChange={setItemWidth}
									value={width}
								/>
							</PanelRow>
						)
					}
					<br />
					<PanelRow>
						<ListStyleUI
							value={listStyle}
							onChange={switchStyle}
							placement="inspector"
						/>
					</PanelRow>
					<PanelRow>
						<Orientation
							listOrientation={listOrientation}
							updateOrientation={updateOrientation}
							placement="inspector"
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<ListContainer {...innerBlockProps} />
		</>
	);
}
