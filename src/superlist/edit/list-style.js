/**
 * External dependencies
 */
import { find } from "lodash";

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { ToolbarGroup, Button } from "@wordpress/components";
import { formatListBullets, formatListNumbered, menu } from "@wordpress/icons";

const DEFAULT_LIST_CONTROLS = [
	{
		icon: formatListBullets,
		title: __("Unordered list", "superlist-block"),
		listStyle: "ul",
	},
	{
		icon: formatListNumbered,
		title: __("Ordered List", "superlist-block"),
		listStyle: "ol",
	},
	{
		icon: menu,
		title: __("No marker", "superlist-block"),
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
	describedBy = __("Change list style"),
	isCollapsed = true,
	placement,
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

	return "toolbar" === placement ? (
		<ToolbarGroup
			icon={setIcon()}
			label={__(describedBy, "superlist-block")}
			popoverProps={POPOVER_PROPS}
			isCollapsed
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
		/>
	) : (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<legend>{__(`${describedBy}`, "superlist-block")}</legend>
			<div>
				{listControls.map(({ icon, listStyle, title }) => {
					return (
						<Button
							key={listStyle}
							label={__(title, "superlist-block")}
							icon={icon}
							isPressed={listStyle === value}
							onClick={applyOrUnset(listStyle)}
						/>
					);
				})}
			</div>
		</fieldset>
	);
}

export default ListStyleUI;
