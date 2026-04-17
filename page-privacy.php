<?php
/**
 * Privacy Policy Page Template
 *
 * @package EduBlink_Child
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Timber\Timber' ) ) {
	echo 'Timber plugin is not installed.';
	return;
}

$context             = Timber::context();
$context['theme_uri'] = get_stylesheet_directory_uri();

Timber::render( 'page-privacy.twig', $context );
