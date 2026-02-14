<?php
/**
 * Template Name: Front Page
 * 
 * Front page template for the home page
 * Uses Timber Twig template
 * 
 * @package EduBlink_Child
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Check if Timber is available
if ( ! class_exists( 'Timber\Timber' ) ) {
	echo 'Timber plugin is not installed.';
	return;
}

// Get Timber context
$context = Timber::context();

// Add theme directory URI to context
$context['theme_uri'] = get_stylesheet_directory_uri();

// Capture wp_head and wp_footer output
ob_start();
wp_head();
$context['wp_head'] = ob_get_clean();

ob_start();
wp_footer();
$context['wp_footer'] = ob_get_clean();

// Get featured courses from Tutor LMS
$context['courses'] = array();
if ( function_exists( 'tutor_utils' ) ) {
	$course_post_type = tutor()->course_post_type;
	
	// Get featured courses (limit to 6)
	$args = array(
		'post_type'      => $course_post_type,
		'post_status'    => 'publish',
		'posts_per_page' => 6,
		'orderby'        => 'date',
		'order'          => 'DESC',
	);
	
	$courses_query = new WP_Query( $args );
	
	if ( $courses_query->have_posts() ) {
		while ( $courses_query->have_posts() ) {
			$courses_query->the_post();
			$course_id = get_the_ID();
			
			// Get course data using Timber::get_post()
			$course = Timber::get_post( $course_id );
			
			if ( $course ) {
				// Get course rating
				$course_rating = tutor_utils()->get_course_rating( $course_id );
				$course->rating_avg = $course_rating ? number_format( $course_rating->rating_avg, 1 ) : 0;
				$course->rating_count = $course_rating ? $course_rating->rating_count : 0;
				
				// Get course price
				$course->price = apply_filters( 'get_tutor_course_price', null, $course_id );
				
				// Get course duration
				$course->duration = get_tutor_course_duration_context( $course_id );
				
				// Get lesson count
				$course->lesson_count = tutor_utils()->get_lesson_count_by_course( $course_id );
				
				// Get students count
				$course->students_count = tutor_utils()->count_enrolled_users_by_course( $course_id );
				
				// Get instructors
				$instructors = tutor_utils()->get_instructors_by_course( $course_id );
				if ( ! empty( $instructors ) && isset( $instructors[0]->ID ) ) {
					$course->instructor = Timber::get_user( $instructors[0]->ID );
				} else {
					$course->instructor = null;
				}
				
				// Get course level
				$course->level = get_post_meta( $course_id, '_tutor_course_level', true );
				if ( empty( $course->level ) ) {
					$course->level = 'مبتدئ';
				}
				
				// Get course image
				$course->thumbnail = get_the_post_thumbnail_url( $course_id, 'full' );
				if ( ! $course->thumbnail ) {
					$course->thumbnail = tutor()->url . 'assets/images/placeholder-course.jpg';
				}
				
				$context['courses'][] = $course;
			}
		}
		wp_reset_postdata();
	}
}

// Get products with bundles (same method as single-product-bundle.twig and functions.php)
$context['bundles'] = array();
$debug_info = array(
	'woocommerce_exists' => class_exists( 'WooCommerce' ),
	'table_name' => '',
	'table_exists' => false,
	'bundle_product_ids_count' => 0,
	'bundle_product_ids' => array(),
	'bundles_count' => 0,
);

if ( class_exists( 'WooCommerce' ) ) {
	global $wpdb;
	
	// Use the same method as functions.php line 287-291
	$table_name = $wpdb->prefix . 'asnp_wepb_simple_bundle_items';
	$debug_info['table_name'] = $table_name;
	
	// Check if table exists
	$table_exists = $wpdb->get_var( "SHOW TABLES LIKE '{$table_name}'" ) === $table_name;
	$debug_info['table_exists'] = $table_exists;
	
	if ( $table_exists ) {
		// Get all product IDs that have bundles (same query as used in functions.php)
		$bundle_product_ids = $wpdb->get_col(
			"SELECT DISTINCT bundle_id FROM {$table_name} WHERE bundle_id > 0"
		);
		$debug_info['bundle_product_ids_count'] = count( $bundle_product_ids );
		$debug_info['bundle_product_ids'] = $bundle_product_ids;
		
		if ( ! empty( $bundle_product_ids ) ) {
			// Loop through each bundle product ID and verify it has bundles
			foreach ( $bundle_product_ids as $bundle_product_id ) {
				// Verify this product actually has bundles (same check as functions.php line 287-290)
				$has_bundles = $wpdb->get_var( $wpdb->prepare(
					"SELECT COUNT(*) FROM {$table_name} WHERE bundle_id = %d",
					$bundle_product_id
				) );
				
				// Only process if bundle has items (same check as functions.php line 291)
				if ( $has_bundles > 0 ) {
					$product = wc_get_product( $bundle_product_id );
					
					// Check if product exists and is published
					if ( $product && $product->exists() ) {
						$post_status = get_post_status( $bundle_product_id );
						if ( $post_status === 'publish' ) {
							// Get bundle items count
							$bundle_items_count = intval( $has_bundles );
							
							// Get product data
							$bundle_data = array(
								'id' => $bundle_product_id,
								'title' => $product->get_name(),
								'link' => get_permalink( $bundle_product_id ),
								'thumbnail' => get_the_post_thumbnail_url( $bundle_product_id, 'full' ) ?: wc_placeholder_img_src(),
								'bundle_items_count' => $bundle_items_count,
							);
							
							// Get product prices
							$regular_price = $product->get_regular_price();
							$sale_price = $product->get_sale_price();
							$price = $product->get_price();
							
							$bundle_data['regular_price'] = $regular_price ? floatval( $regular_price ) : null;
							$bundle_data['sale_price'] = $sale_price ? floatval( $sale_price ) : null;
							$bundle_data['price'] = $price ? floatval( $price ) : 0;
							
							// Calculate discount percentage
							if ( $bundle_data['sale_price'] && $bundle_data['regular_price'] && $bundle_data['regular_price'] > 0 ) {
								$bundle_data['discount_percent'] = round( ( ( $bundle_data['regular_price'] - $bundle_data['sale_price'] ) / $bundle_data['regular_price'] ) * 100 );
							} else {
								$bundle_data['discount_percent'] = 0;
							}
							
							// Check if product is free
							$bundle_data['is_free'] = ( ! $bundle_data['regular_price'] && ! $bundle_data['sale_price'] ) || $bundle_data['price'] == 0;
							
							// Get product rating
							$average_rating = $product->get_average_rating();
							$rating_count = $product->get_rating_count();
							$bundle_data['rating_avg'] = $average_rating ? number_format( $average_rating, 1 ) : 0;
							$bundle_data['rating_count'] = $rating_count;
							
							$context['bundles'][] = $bundle_data;
							
							// Limit to 6 bundles
							if ( count( $context['bundles'] ) >= 6 ) {
								break;
							}
						}
					}
				}
			}
		}
	}
}

// Debug: Add debug info to context (temporary)
$debug_info['bundles_count'] = count( $context['bundles'] );
$context['debug_bundles'] = $debug_info;

// Temporary debug output
if ( isset( $_GET['debug'] ) && $_GET['debug'] === 'bundles' ) {
	echo '<pre>';
	echo 'WooCommerce exists: ' . ( $debug_info['woocommerce_exists'] ? 'YES' : 'NO' ) . "\n";
	echo 'Table name: ' . $debug_info['table_name'] . "\n";
	echo 'Table exists: ' . ( $debug_info['table_exists'] ? 'YES' : 'NO' ) . "\n";
	echo 'Bundle product IDs found: ' . $debug_info['bundle_product_ids_count'] . "\n";
	echo 'Bundle product IDs: ' . implode( ', ', $debug_info['bundle_product_ids'] ) . "\n";
	echo 'Bundles count: ' . $debug_info['bundles_count'] . "\n";
	echo 'Bundles array: ' . print_r( $context['bundles'], true ) . "\n";
	echo '</pre>';
	exit;
}

// Render Twig template
Timber::render( 'front-page.twig', $context );

