<?php
/*
Plugin Name: Admin Quick Search
Description: Adds an autocompleting search box to the admin bar for quickly finding and jumping to a post
Version: 0.2
Author: daxitude
Author URI: http://github.com/daxitude/
Plugin URI: http://github.com/daxitude/wp-admin-quick-search
*/

class Admin_Quick_Search {
	
	public function __construct() {
		add_action('init', array($this, 'rewrite_rule'));
		add_action('template_redirect', array($this, 'template_redirect'));

		if ( is_admin() ) {
			add_action('admin_bar_menu', array($this, 'add_search_form'), 99);
			add_action('admin_enqueue_scripts', array($this, 'add_css'));
			add_action('admin_print_scripts', array($this, 'add_js'));
		}
	}
	
	// add rewrite rule to allow custom endpoints as 'json'
	public function rewrite_rule() {
		add_rewrite_endpoint('json', EP_SEARCH);
	}
	
	// catch requests to search and return json with custom template
	public function template_redirect() {
		global $wp_query;
	    if ( ! is_search() || ! isset( $wp_query->query_vars['json'] ) )
	        return;

	    // include custom template
	    require_once dirname( __FILE__ ) . '/search.php';
	    exit;
	}
	
	// add the search input to the admin bar
	public function add_search_form() {
		global $wp_admin_bar;
		
		$wp_admin_bar->add_node(array(
			'id' => 'admin-quick-search',
			'title' => '<input type="text" placeholder="Search Posts" name="s" id="adminqs" autocomplete="off">',
			'meta' => array( 'class' => 'menupop'),
			'html' => '<div></div>'
		));
	}
	
	// add css to admin pages to style the input 
	public function add_css() {		
		wp_register_style('adminquicksearch', plugins_url( 'adminquicksearch.css', __FILE__ ) );
		wp_enqueue_style( 'adminquicksearch' );
	}
	
	// add js to admin pages to control the input
	public function add_js() {		
		wp_register_script( 'adminquicksearch',
			plugins_url( 'adminquicksearch.js', __FILE__ ), '', '1.0', 'true'
		);
		wp_enqueue_script( 'adminquicksearch' );
	}
		
}

new Admin_Quick_Search();
