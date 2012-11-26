<?php

$term = esc_sql( like_escape( $_GET['s'] ) );

global $wpdb;

$posts = $wpdb->get_results(
	"
	SELECT * FROM $wpdb->posts
	WHERE post_title LIKE '%{$term}%'
	AND post_type NOT IN ('draft', 'revision', 'nav_menu_item', 'attachment')
	LIMIT 10
	"
);

$found_posts = array();

foreach( $posts as $post ) {
	$found_posts[] = array(
		'title' => $post->post_title,
		'link' => get_edit_post_link($post->ID)
	);
}

echo json_encode($found_posts);

