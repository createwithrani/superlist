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
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { arrowRight, arrowDown } from "@wordpress/icons";
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
	const { attributes, setAttributes, clientId } = props;
	const { listStyle, orientation } = attributes;
	const hasInnerBlocks = useSelect([clientId]);
	const blockProps = useBlockProps({
		className: listStyle + " " + orientation,
	});

	const innerBlockProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: LIST_TEMPLATE,
		orientation: `${orientation}`,
		templateInsertUpdateSelection: true,
		// renderAppender: hasInnerBlocks
		// 	? undefined
		// 	: InnerBlocks.ButtonBlockAppender,
	});
	function switchStyle(style) {
		setAttributes({ listStyle: style });
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
					label="Horizontal orientation"
					onClick={() => setAttributes({ orientation: "horizontal" })}
					isActive={orientation === "horizontal"}
				/>
				<ToolbarButton
					icon={arrowDown}
					label="Vertical Orientation"
					onClick={() => setAttributes({ orientation: "vertical" })}
					isActive={orientation === "vertical"}
				/>
			</BlockControls>
			<InspectorControls>
				<Panel>
					<PanelBody initialOpen={true} title="List Settings">
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
										label="Horizontal orientation"
										onClick={() => setAttributes({ orientation: "horizontal" })}
										isPressed={orientation === "horizontal"}
									/>
									<Button
										icon={arrowDown}
										label="Vertical Orientation"
										onClick={() => setAttributes({ orientation: "vertical" })}
										isPressed={orientation === "vertical"}
									/>
								</div>
							</fieldset>
						</PanelRow>
					</PanelBody>
				</Panel>
			</InspectorControls>
			<ListContainer {...innerBlockProps} />
		</>
	);
}
