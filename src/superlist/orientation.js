import { __ } from "@wordpress/i18n";
import { ToolbarButton, Button } from "@wordpress/components";
import { arrowRight, arrowDown } from "@wordpress/icons";

export const Orientation = ({ orientation, setAttributes, placement }) => {
	return "toolbar" === placement ? (
		<>
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
		</>
	) : (
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
	);
};
