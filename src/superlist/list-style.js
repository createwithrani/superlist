/**
 * External dependencies
 */
import { find } from "lodash";

/**
 * WordPress dependencies
 */
import { __, isRTL } from "@wordpress/i18n";
import { DropdownMenu, ToolbarGroup } from "@wordpress/components";
import { formatListBullets, formatListNumbered, menu } from "@wordpress/icons";

const DEFAULT_LIST_CONTROLS = [
	{
		icon: formatListBullets,
		title: __("Unordered list"),
		listStyle: "ul",
	},
	{
		icon: formatListNumbered,
		title: __("Ordered List"),
		listStyle: "ol",
	},
	{
		icon: menu,
		title: __("No marker"),
		listStyle: "none",
	},
];

const POPOVER_PROPS = {
	position: "bottom right",
	isAlternate: true,
};

function ListStyleUI({
	value,
	onChange,
	listControls = DEFAULT_LIST_CONTROLS,
	label = __("Superlist"),
	describedBy = __("Change list style"),
	isCollapsed = true,
	isToolbar = true,
	isToolbarButton = true,
}) {
	function applyOrUnset(listStyle) {
		return () => onChange(value === listStyle ? undefined : listStyle);
	}

	const activeStyle = find(
		listControls,
		(control) => control.listStyle === value
	);

	function setIcon() {
		if (activeStyle) return activeStyle.icon;
	}

	const UIComponent = isToolbar ? ToolbarGroup : DropdownMenu;
	const extraProps = isToolbar ? { isCollapsed } : { isToolbarButton };

	return (
		<UIComponent
			icon={setIcon()}
			label={label}
			toggleProps={{ describedBy }}
			popoverProps={POPOVER_PROPS}
			controls={listControls.map((control) => {
				const { listStyle } = control;
				const isActive = value === listStyle;

				return {
					...control,
					isActive,
					role: isCollapsed ? "menuitemradio" : undefined,
					onClick: applyOrUnset(listStyle),
				};
			})}
			{...extraProps}
		/>
	);
}

export default ListStyleUI;
