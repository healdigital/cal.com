<?php
/**
 * Shortcode definitions for Thotis Mentoring.
 * Each shortcode renders a container div that the React app hydrates.
 */

if (!defined('ABSPATH')) {
    exit;
}

class Thotis_Shortcodes {

    public static function init(): void {
        add_shortcode('thotis_landing', [self::class, 'render_landing']);
        add_shortcode('thotis_mentors', [self::class, 'render_mentors']);
        add_shortcode('thotis_mentor_profile', [self::class, 'render_mentor_profile']);
        add_shortcode('thotis_sessions', [self::class, 'render_sessions']);
        add_shortcode('thotis_rating', [self::class, 'render_rating']);
    }

    /**
     * Ensure the React app is enqueued when a shortcode is used.
     */
    private static function enqueue(): void {
        wp_enqueue_script('thotis-app');
        wp_enqueue_style('thotis-styles');
    }

    /**
     * [thotis_landing] — Landing page with orientation form and hero section.
     */
    public static function render_landing(array $atts = []): string {
        self::enqueue();
        return '<div id="thotis-landing" class="thotis-root"></div>';
    }

    /**
     * [thotis_mentors field="INFORMATIQUE" limit="20"] — Mentor search and grid.
     */
    public static function render_mentors(array $atts = []): string {
        self::enqueue();
        $atts = shortcode_atts([
            'field' => '',
            'limit' => 20,
        ], $atts, 'thotis_mentors');

        return sprintf(
            '<div id="thotis-mentors" class="thotis-root" data-field="%s" data-limit="%d"></div>',
            esc_attr($atts['field']),
            intval($atts['limit'])
        );
    }

    /**
     * [thotis_mentor_profile username="jean"] — Single mentor profile + booking widget.
     * If no username attribute, reads from the URL slug via rewrite rules.
     */
    public static function render_mentor_profile(array $atts = []): string {
        self::enqueue();
        $atts = shortcode_atts([
            'username' => '',
        ], $atts, 'thotis_mentor_profile');

        // Try to get username from URL if not provided as attribute
        $username = $atts['username'];
        if (empty($username)) {
            $username = get_query_var('thotis_mentor', '');
        }

        return sprintf(
            '<div id="thotis-mentor-profile" class="thotis-root" data-username="%s"></div>',
            esc_attr($username)
        );
    }

    /**
     * [thotis_sessions] — Student sessions dashboard.
     * Supports ?token= query parameter for guest magic link access.
     */
    public static function render_sessions(array $atts = []): string {
        self::enqueue();

        // Pass the guest token from URL if present
        $token = isset($_GET['token']) ? sanitize_text_field(wp_unslash($_GET['token'])) : '';

        return sprintf(
            '<div id="thotis-sessions" class="thotis-root" data-token="%s"></div>',
            esc_attr($token)
        );
    }

    /**
     * [thotis_rating uid="abc123"] — Post-session rating form.
     * Supports ?token= for guest access.
     */
    public static function render_rating(array $atts = []): string {
        self::enqueue();
        $atts = shortcode_atts([
            'uid' => '',
        ], $atts, 'thotis_rating');

        $uid = $atts['uid'];
        if (empty($uid)) {
            $uid = get_query_var('thotis_rating_uid', '');
        }

        $token = isset($_GET['token']) ? sanitize_text_field(wp_unslash($_GET['token'])) : '';

        return sprintf(
            '<div id="thotis-rating" class="thotis-root" data-uid="%s" data-token="%s"></div>',
            esc_attr($uid),
            esc_attr($token)
        );
    }
}
