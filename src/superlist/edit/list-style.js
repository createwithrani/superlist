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
		title: __("Ordered list", "superlist-block"),
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
	describedBy = __("Change list type", "superlist-block"),
	isCollapsed = true,
	placement,
}) {
	function applyOrUnset(listStyle) {
		return () => onChange(value === listStyle ? undefined : listStyle);
	}

	const activeStyle = listControls.find(
		(control) => control.listStyle === value
	);

	function setIcon() {
		if (activeStyle) return activeStyle.icon;
	}

	return "toolbar" === placement ? (
		<ToolbarGroup
			icon={setIcon()}
			label={describedBy}
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
			<legend>{describedBy}</legend>
			<div>
				{listControls.map(({ icon, listStyle, title }) => {
					return (
						<Button
							key={listStyle}
							label={title}
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
