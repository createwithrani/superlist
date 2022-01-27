/**
 * External dependencies
 */
import { find } from "lodash";

/**
 * WordPress dependencies
 */
import { __, isRTL } from "@wordpress/i18n";
import {
	DropdownMenu,
	ToolbarGroup,
	Flex,
	FlexItem,
	Button,
} from "@wordpress/components";
import { formatListBullets, formatListNumbered, menu } from "@wordpress/icons";
// import { Button } from "@wordpress/block-editor";

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
	label = __("Superlist"),
	describedBy = __("Change list style"),
	isCollapsed = true,
	isToolbar = true,
	isToolbarButton = true,
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

	function setPlacement() {
		if ("toolbar" === placement) {
			return isToolbar ? ToolbarGroup : DropdownMenu;
		} else {
			isToolbar ? ToolbarGroup : DropdownMenu;
		}
	}

	const UIComponent = isToolbar ? ToolbarGroup : DropdownMenu;
	const extraProps = isToolbar ? { isCollapsed } : { isToolbarButton };

	return "toolbar" === placement ? (
		<UIComponent
			icon={setIcon()}
			label={__(label, "superlist-block")}
			toggleProps={__(describedBy, "superlist-block")}
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
