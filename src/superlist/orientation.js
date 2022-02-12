import { __ } from "@wordpress/i18n";
import { ToolbarButton, Button } from "@wordpress/components";
import { arrowRight, arrowDown } from "@wordpress/icons";

export const Orientation = ({
	listOrientation,
	placement,
	updateOrientation,
}) => {
	return "toolbar" === placement ? (
		<>
			<ToolbarButton
				icon={arrowRight}
				label={__("Horizontal orientation", "superlist-block")}
				onClick={() => {
					updateOrientation("horizontal");
				}}
				isActive={listOrientation === "horizontal"}
			/>
			<ToolbarButton
				icon={arrowDown}
				label={__("Vertical Orientation", "superlist-block")}
				onClick={() => {
					updateOrientation("vertical");
				}}
				isActive={listOrientation === "vertical"}
			/>
		</>
	) : (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<legend>{__("Orientation")}</legend>
			<div>
				<Button
					icon={arrowRight}
					label={__("Horizontal orientation")}
					onClick={() => {
						updateOrientation("horizontal");
					}}
					isPressed={listOrientation === "horizontal"}
				/>
				<Button
					icon={arrowDown}
					label={__("Vertical Orientation")}
					onClick={() => {
						updateOrientation("vertical");
					}}
					isPressed={listOrientation === "vertical"}
				/>
			</div>
		</fieldset>
	);
};
