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
		add_action('init', array($this, 'rewrite_rule'));
		add_action('template_redirect', array($this, 'template_redirect'));
		add_action('admin_enqueue_scripts', array($this, 'add_css'));
		add_action('admin_print_scripts', array($this, 'add_js'));
		add_action('admin_bar_menu', array($this, 'add_search_form'), 99);
	}

	public function add_css() {		
		wp_register_style('adminquicksearch', plugins_url( 'adminquicksearch.css', __FILE__ ) );
		wp_enqueue_style( 'adminquicksearch' );
	}
		
	public function add_js() {		
		wp_register_script( 'adminquicksearch',
			plugins_url( 'adminquicksearch.js', __FILE__ ), '', '1.0', 'true'
		);
		wp_enqueue_script( 'adminquicksearch' );
	}
	
	public function add_search_form() {
		global $wp_admin_bar;
		
		$wp_admin_bar->add_node(array(
			'id' => 'admin-quick-search',
			'title' => '<input type="text" value="" placeholder="Search Posts..." name="s" id="adminqs" autocomplete="off">'
		));
	}
	
	public function template_redirect() {
		global $wp_query;
//		var_dump($wp_query->request);
	    // if this is not a request for json or a singular object then bail
	    if ( ! isset( $wp_query->query_vars['json'] ) )
	        return;

	    // include custom template
	    require_once dirname( __FILE__ ) . '/search.php';
	    exit;
	}
	
	public function rewrite_rule() {
		add_rewrite_endpoint('json', EP_SEARCH);
	}
		
}

//if ( is_admin() )
	new Admin_Quick_Search();
