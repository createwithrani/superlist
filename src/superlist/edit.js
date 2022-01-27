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
	InspectorControls,
	useSetting,
} from "@wordpress/block-editor";
import {
	Toolbar,
	ToolbarButton,
	Panel,
	PanelBody,
	PanelRow,
	Button,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { arrowRight, arrowDown } from "@wordpress/icons";
import { useState } from "@wordpress/element";
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";
import ListStyleUI from "./list-style";

/**
 * Internal Dependencies
 */
import { name as allowedBlock } from "../superlist-item";
const ALLOWED_BLOCKS = [allowedBlock];
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
export default function Edit(props) {
	const { attributes, setAttributes } = props;
	const { listStyle, orientation, itemWidth } = attributes;
	const [width, setWidth] = useState(itemWidth);
	const subItemWidth = {
		gridTemplateColumns: `repeat(auto-fill, minmax(${width}, 1fr))`,
	};
	const blockProps = useBlockProps({
		className: `${listStyle} ${orientation}`,
		style: "horizontal" === orientation ? subItemWidth : {},
	});

	const innerBlockProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: LIST_TEMPLATE,
		orientation: `${orientation}`,
		templateInsertUpdateSelection: true,
	});
	function switchStyle(style) {
		setAttributes({ listStyle: style });
	}
	function setItemWidth(value) {
		setWidth(value);
		setAttributes({ itemWidth: value });
	}
	const ListContainer = "none" !== listStyle ? listStyle : "div";
	return (
		<>
			<BlockControls>
				<ListStyleUI
					value={listStyle}
					onChange={switchStyle}
					placement="toolbar"
				/>
				<ToolbarButton
					icon={arrowRight}
					label={__("Horizontal orientation", "superlist-block")}
					onClick={() => setAttributes({ orientation: "horizontal" })}
					isActive={orientation === "horizontal"}
				/>
				<ToolbarButton
					icon={arrowDown}
					label={__("Vertical Orientation", "superlist-block")}
					onClick={() => setAttributes({ orientation: "vertical" })}
					isActive={orientation === "vertical"}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					initialOpen={true}
					title={__("Repeater Settings", "superlist-block")}
				>
					{orientation === "horizontal" && (
						<PanelRow>
							<UnitControl
								label={__("Sub-item max-width", "superlist-block")}
								onChange={setItemWidth}
								value={width}
							/>
						</PanelRow>
					)}
					<br />
					<PanelRow>
						<ListStyleUI
							value={listStyle}
							onChange={switchStyle}
							placement="inspector"
						/>
					</PanelRow>
					<PanelRow>
						<fieldset className="block-editor-hooks__flex-layout-justification-controls">
							<legend>{__("Orientation")}</legend>
							<div>
								<Button
									icon={arrowRight}
									label={__("Horizontal orientation")}
									onClick={() => setAttributes({ orientation: "horizontal" })}
									isPressed={orientation === "horizontal"}
								/>
								<Button
									icon={arrowDown}
									label={__("Vertical Orientation")}
									onClick={() => setAttributes({ orientation: "vertical" })}
									isPressed={orientation === "vertical"}
								/>
							</div>
						</fieldset>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<ListContainer {...innerBlockProps} />
		</>
	);
}
