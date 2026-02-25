<?php
/**
 * Custom rewrite rules for clean Thotis URLs.
 *
 * Provides:
 *   /mentorat/mentor/{username}/  → mentor profile
 *   /mentorat/noter/{uid}/        → rating page
 */

if (!defined('ABSPATH')) {
    exit;
}

class Thotis_Rewrite {

    public static function init(): void {
        add_action('init', [self::class, 'register_rules']);
        add_filter('query_vars', [self::class, 'register_vars']);
    }

    /**
     * Register custom rewrite rules.
     * These rules assume pages exist at /mentorat/mentor/ and /mentorat/noter/
     */
    public static function register_rules(): void {
        // /mentorat/mentor/{username}/ → page "mentor" under "mentorat" with query var
        add_rewrite_rule(
            '^mentorat/mentor/([^/]+)/?$',
            'index.php?pagename=mentorat/mentor&thotis_mentor=$matches[1]',
            'top'
        );

        // /mentorat/noter/{uid}/ → page "noter" under "mentorat" with query var
        add_rewrite_rule(
            '^mentorat/noter/([^/]+)/?$',
            'index.php?pagename=mentorat/noter&thotis_rating_uid=$matches[1]',
            'top'
        );
    }

    /**
     * Register custom query variables.
     */
    public static function register_vars(array $vars): array {
        $vars[] = 'thotis_mentor';
        $vars[] = 'thotis_rating_uid';
        return $vars;
    }
}
