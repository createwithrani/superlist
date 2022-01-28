<?php
/**
 * Plugin Name:       Super List Block
 * Description:       Nest multiple blocks inside lists of any kind of list (ordered, unordered, no marker, etc), or do away with list markers and use it like a repeater!
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Aurooba Ahmed
 * Author URI:        https://aurooba.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       superlist-block
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

	$asset_file = include plugin_dir_path( SUPERLIST_BLOCK_PLUGIN_FILE ) . 'build/index.asset.php';

	wp_register_script(
		'superlistblock-js',
		plugins_url( 'build/index.js', SUPERLIST_BLOCK_PLUGIN_FILE ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true,
	);

	wp_localize_script(
		'superlistblock-js',
		'superlist_data',
		array(
			'example1'  => plugins_url( 'assets/example1.jpg', SUPERLIST_BLOCK_PLUGIN_FILE ),
			'example2'  => plugins_url( 'assets/example2.jpg', SUPERLIST_BLOCK_PLUGIN_FILE ),
		)
	);

	wp_enqueue_script('superlistblock-js');

	// Load available translations.
	wp_set_script_translations( 'createwithrani-superlist-block-editor-script-js', 'superlist-block' );
}
add_action( 'init', 'create_block_superlist_block_block_init' );
