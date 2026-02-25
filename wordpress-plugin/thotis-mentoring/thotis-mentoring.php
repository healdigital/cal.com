<?php
/**
 * Plugin Name: Thotis Mentoring
 * Plugin URI: https://thotismedia.com
 * Description: Intègre le système de mentorat Thotis dans WordPress. Affiche la recherche de mentors, la réservation de sessions et le suivi pour les élèves.
 * Version: 1.0.0
 * Author: Thotis Media
 * Author URI: https://thotismedia.com
 * Text Domain: thotis-mentoring
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 8.0
 */

if (!defined('ABSPATH')) {
    exit;
}

define('THOTIS_MENTORING_VERSION', '1.0.0');
define('THOTIS_MENTORING_DIR', plugin_dir_path(__FILE__));
define('THOTIS_MENTORING_URL', plugin_dir_url(__FILE__));

// Load plugin components
require_once THOTIS_MENTORING_DIR . 'includes/class-thotis-admin.php';
require_once THOTIS_MENTORING_DIR . 'includes/class-thotis-shortcodes.php';
require_once THOTIS_MENTORING_DIR . 'includes/class-thotis-seo.php';
require_once THOTIS_MENTORING_DIR . 'includes/class-thotis-rewrite.php';

/**
 * Main plugin class
 */
final class Thotis_Mentoring {

    private static ?Thotis_Mentoring $instance = null;

    public static function instance(): Thotis_Mentoring {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('init', [$this, 'init']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);

        Thotis_Admin::init();
        Thotis_Shortcodes::init();
        Thotis_SEO::init();
        Thotis_Rewrite::init();
    }

    public function init(): void {
        load_plugin_textdomain('thotis-mentoring', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }

    /**
     * Register and enqueue front-end assets.
     * Scripts are only loaded on pages that contain Thotis shortcodes.
     */
    public function enqueue_assets(): void {
        // Register (but don't enqueue yet — shortcodes will enqueue on demand)
        wp_register_script(
            'thotis-app',
            THOTIS_MENTORING_URL . 'dist/thotis.js',
            [],
            THOTIS_MENTORING_VERSION,
            true
        );

        wp_register_style(
            'thotis-styles',
            THOTIS_MENTORING_URL . 'dist/thotis.css',
            [],
            THOTIS_MENTORING_VERSION
        );

        // Pass configuration to the React app
        wp_localize_script('thotis-app', 'thotisConfig', [
            'apiUrl'  => rtrim(get_option('thotis_api_url', 'https://meet.heal-digital.com/api/thotis'), '/'),
            'wpUrl'   => rtrim(home_url(), '/'),
            'locale'  => get_locale(),
            'nonce'   => wp_create_nonce('thotis_mentoring'),
        ]);
    }

    /**
     * Get the configured API base URL.
     */
    public static function api_url(): string {
        return rtrim(get_option('thotis_api_url', 'https://meet.heal-digital.com/api/thotis'), '/');
    }
}

// Boot the plugin
Thotis_Mentoring::instance();

// Activation hook — flush rewrite rules
register_activation_hook(__FILE__, function () {
    Thotis_Rewrite::register_rules();
    flush_rewrite_rules();
});

// Deactivation hook
register_deactivation_hook(__FILE__, function () {
    flush_rewrite_rules();
});
