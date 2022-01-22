<?php
/**
 * Plugin Name:       Super List Block
 * Description:       A list block that allows you to nest other blocks in each list item.
 * Requires at least: 5.9-RC3
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Aurooba Ahmed
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       superlist
 *
 * @package           superlist-block
 */

if ( ! defined( 'SUPERLIST_BLOCK_PLUGIN_FILE' ) ) {
	define( 'SUPERLIST_BLOCK_PLUGIN_FILE', __FILE__ );
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/writing-your-first-block-type/
 */
function create_block_superlist_block_block_init() {
	register_block_type( plugin_dir_path( SUPERLIST_BLOCK_PLUGIN_FILE ) . 'src/superlist' );
	register_block_type( plugin_dir_path( SUPERLIST_BLOCK_PLUGIN_FILE ) . 'src/superlist-item' );
}
add_action( 'init', 'create_block_superlist_block_block_init' );
