/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
	ToolbarButton,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";

/**
 * Custom inline icons for "horizontal layout" (a row of bars) and
 * "vertical layout" (a stack of bars). These read more clearly than the
 * generic arrow icons that previously labeled this control.
 */
const horizontalIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
	>
		<rect x="3" y="6" width="4" height="12" rx="1" />
		<rect x="10" y="6" width="4" height="12" rx="1" />
		<rect x="17" y="6" width="4" height="12" rx="1" />
	</svg>
);

const verticalIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
	>
		<rect x="6" y="3" width="12" height="4" rx="1" />
		<rect x="6" y="10" width="12" height="4" rx="1" />
		<rect x="6" y="17" width="12" height="4" rx="1" />
	</svg>
);

const Orientation = ({ listOrientation, placement, updateOrientation }) => {
	if (placement === "toolbar") {
		return (
			<>
				<ToolbarButton
					icon={horizontalIcon}
					label={__("Horizontal layout", "superlist-block")}
					onClick={() => updateOrientation("horizontal")}
					isActive={listOrientation === "horizontal"}
				/>
				<ToolbarButton
					icon={verticalIcon}
					label={__("Vertical layout", "superlist-block")}
					onClick={() => updateOrientation("vertical")}
					isActive={listOrientation === "vertical"}
				/>
			</>
		);
	}

	return (
		<ToggleGroupControl
			label={__("List Style", "superlist-block")}
			value={listOrientation}
			onChange={(value) => updateOrientation(value)}
			isBlock
			__nextHasNoMarginBottom
		>
			<ToggleGroupControlOption
				value="vertical"
				label={__("Vertical", "superlist-block")}
			/>
			<ToggleGroupControlOption
				value="horizontal"
				label={__("Horizontal", "superlist-block")}
			/>
		</ToggleGroupControl>
	);
};

export default Orientation;
