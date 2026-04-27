=== Super List Block ===
Contributors:      aurooba, cr0ybot
Tags:              block, list, nesting, repeater, superlist
Requires at least: 6.3
Tested up to:      6.9
Requires PHP:      7.0
Stable tag:        0.2.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Donate link:       https://github.com/sponsors/aurooba

Nest multiple blocks inside lists of any kind of list (ordered, unordered, no marker, etc), or do away with list markers and use it like a repeater!

== Description ==

A handy little block that can be used in a variety of ways. Use it to nest other blocks inside list items, to create simple grid layouts ( like a properly responsive pricing table, or a wrapping icon list), or however you please.

This block is very light on styles (and avoids unnecessary div soup!). It aims to provide you with as much flexibility as possible, so you can harness it to create the content structure and layout you like.

If you enjoy the block, please leave a review! ⭐

If you have a feature request, please create an issue in the [GitHub repository](https://github.com/createwithrani/superlist). ➕

If you need support, please use the support forum to reach out. 🆘


=== Key Features ===

### A video tutorial to guide you through the features

https://youtu.be/wqzw-XrwuQE

* Nest blocks inside ordered and unordered lists.
* Nest blocks inside lists without any markers.
* Let's you create single column content or grid like content with the horizontal orientation setting.
* Supports native color, padding, and margin settings. 🎉
* Has a handy `add` button in the toolbar of list items to easily add more items while you're in the flow.
* Exposes the inner inserter with a clear text label for easy insertion.
* Built entirely native WordPress Block Editor components
* There is a pro version coming with even more features!

=== Stay Connected ===

* [Follow @aurooba on Twitter](https://twitter.com/aurooba)
* [View this plugin on GitHub](https://github.com/createwithrani/superlist)

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/` directory, install the plugin through the WordPress plugins screen directly, or search for `Super List Block` in the Block Library.
2. Activate the plugin through the 'Plugins' screen in WordPress if installed manually or through the WordPress plugins screen.
3. Use the `Super List` block in the Block Editor

== Screenshots ==

1. Super List is a flexible list block that lets you nest blocks inside each list item!
2. Nesting blocks is easy and works just like it does in group, column, or cover blocks.
3. You can easily re-order list items and even add more list items wherever you need from the list item toolbar.

== Changelog ==

= 0.2.0 =
* Fix critical editor crash caused by missing `sprintf` import in the list-item block (#60).
* Update block icons to a simpler black-on-transparent style for better cohesion with core blocks (#44).
* Rename "List Orientation" to "List Style" and the previous "List Style" (ul/ol/none) to "List Type", with clearer icons (#36).
* Add background image support via the standard block-supports API (#35).
* Add support for ordered list `start` value and reverse numbering (#25).
* Add optional list title rendered as `<figure>` + `<figcaption>` (#13).
* Surface the list-item max-width control on the list-item block as well (#9).
* Add a "double-Enter on an empty trailing paragraph" shortcut to create a new list item (#7).
* Add a custom marker character (e.g. ★, →, •) for unordered lists (#3).
* Update transforms to/from the modern `core/list` block, which uses nested `core/list-item` inner blocks (#54).

= 0.1.4 =
* Fix issue where you can't add new list items
* When adding a new Super List, only one list item is added by default
* List items no longer auto-add a paragraph block, matching the behavior of the Core better
* Fix issue where the Super List level block appender wasn't showing the text label
* Added a blueprint for the plugin repository.

= 0.1.3 =
* Fix semantic output for lists without markers
* Mark plugin as tested with WordPress 6.7.2

= 0.1.1 =
* Fix registration bug that was causing the block to not install correctly
* Clarify Panel and List Item Max Width labels
* Allow indentation for super lists nested inside a list item
* Add typography support to both blocks
* Add transform from core/list block (by @cr0ybot)
* Add fix to ensure Super List is installable from the Block Library search
* Update language .pot file
* Add Anchor Block Support and Vertical Alignment capability
* Add theme.json support

= 0.1.0 =
* Release
