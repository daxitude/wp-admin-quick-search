<?php
/*
Plugin Name: Admin Quick Search
Description: Adds @todo
Version: 0.1
Author: daxitude
Author URI: http://github.com/daxitude/
Plugin URI: http://github.com/daxitude/@todo
*/

class Admin_Quick_Search {
	
	public function __construct() {
		add_action('admin_print_scripts', array($this, 'add_js'));
		add_action('admin_init', array($this, 'add_search_form'));
	}
	
	public function add_js() {		
		wp_register_script('adminquicksearch', plugins_url( 'adminquicksearch.js', __FILE__ ), '', '1.0', 'true');
		wp_enqueue_script( 'adminquicksearch' );
	}
	
	public function add_search_form() {
		global $wp_admin_bar;
		
		$wp_admin_bar->add_node(array(
			'id' => 'admin-quick-search',
			'title' => 'blahbar'
		));
	}
		
}

if ( is_admin() )
	new Admin_Quick_Search();
