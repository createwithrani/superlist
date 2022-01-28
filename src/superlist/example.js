export const example = {
	attributes: {
		listStyle: "none",
		orientation: "horizontal",
		align: "wide",
		itemWidth: "175px",
		style: {
			spacing: {
				padding: { top: "1rem", right: "1rem", bottom: "1rem", left: "1rem" },
			},
		},
		backgroundColor: "light-green-cyan",
	},
	innerBlocks: [
		{
			name: "createwithrani/superlist-item",
			innerBlocks: [
				{
					name: "core/image",
					attributes: {
						sizeSlug: "large",
						linkDestination: "none",
						className: "is-style-default",
						url: superlist_data.example1,
					},
				},
				{
					name: "core/heading",
					attributes: {
						content: "In a list item, you can add any block",
						level: 3,
					},
				},
			],
		},
		{
			name: "createwithrani/superlist-item",
			innerBlocks: [
				{
					name: "core/image",
					attributes: {
						sizeSlug: "large",
						linkDestination: "none",
						className: "is-style-default",
						url: superlist_data.example2,
					},
				},
				{
					name: "core/paragraph",
					attributes: {
						content:
							"This is a list item that can have multiple blocks, feel free to change the list style: bullets, numbered, or no list style at all",
					},
				},
			],
		},
	],
};
