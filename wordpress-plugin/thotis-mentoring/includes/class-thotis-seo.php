<?php
/**
 * SEO helpers for Thotis Mentoring pages.
 * Provides server-side meta tags for mentor profiles and listing pages.
 */

if (!defined('ABSPATH')) {
    exit;
}

class Thotis_SEO {

    public static function init(): void {
        add_action('wp_head', [self::class, 'render_meta_tags'], 1);
        add_filter('document_title_parts', [self::class, 'filter_title']);
        add_filter('the_title', [self::class, 'filter_page_title'], 10, 2);
    }

    /**
     * Inject Open Graph and description meta tags for Thotis pages.
     */
    public static function render_meta_tags(): void {
        if (!is_page()) {
            return;
        }

        $mentor_username = get_query_var('thotis_mentor', '');

        if (!empty($mentor_username)) {
            // Mentor profile page — fetch data server-side for SEO
            $profile = self::fetch_mentor_profile($mentor_username);
            if ($profile) {
                $name = $profile['user']['name'] ?? $mentor_username;
                $bio = wp_trim_words($profile['bio'] ?? '', 30);
                $university = $profile['university'] ?? '';
                $photo = $profile['profilePhotoUrl'] ?? '';

                // Escape the full assembled attribute value to prevent XSS
                $description = esc_attr($name . ' — Mentor ' . $university . '. ' . $bio);
                $og_title = esc_attr($name . ' | Mentorat Thotis');
                $og_desc = esc_attr($bio);
                $og_image = esc_url($photo);

                echo '<meta name="description" content="' . $description . '" />' . "\n";
                echo '<meta property="og:title" content="' . $og_title . '" />' . "\n";
                echo '<meta property="og:description" content="' . $og_desc . '" />' . "\n";
                echo '<meta property="og:type" content="profile" />' . "\n";
                if ($og_image) {
                    echo '<meta property="og:image" content="' . $og_image . '" />' . "\n";
                }
            }
            return;
        }

        // Generic mentoring pages
        global $post;
        if (!$post) {
            return;
        }

        if (has_shortcode($post->post_content, 'thotis_mentors')) {
            echo '<meta name="description" content="Trouvez le mentor id&#233;al pour votre orientation. Parcourez nos profils de mentors &#233;tudiants et r&#233;servez une session gratuite de 15 minutes." />' . "\n";
            echo '<meta property="og:title" content="Nos Mentors | Thotis Media" />' . "\n";
            echo '<meta property="og:description" content="Trouvez le mentor id&#233;al parmi nos &#233;tudiants ambassadeurs." />' . "\n";
        }

        if (has_shortcode($post->post_content, 'thotis_landing')) {
            echo '<meta name="description" content="Thotis Mentorat &#8212; &#201;changez avec des &#233;tudiants de grandes &#233;coles et universit&#233;s pour votre orientation post-bac." />' . "\n";
            echo '<meta property="og:title" content="Mentorat &#201;tudiant | Thotis Media" />' . "\n";
            echo '<meta property="og:description" content="R&#233;servez un appel gratuit de 15 minutes avec un &#233;tudiant mentor." />' . "\n";
        }
    }

    /**
     * Customize the <title> tag for Thotis pages.
     */
    public static function filter_title(array $title): array {
        $mentor_username = get_query_var('thotis_mentor', '');
        if (!empty($mentor_username)) {
            $profile = self::fetch_mentor_profile($mentor_username);
            if ($profile) {
                $name = $profile['user']['name'] ?? $mentor_username;
                $title['title'] = esc_html($name) . ' — Mentor Thotis';
            }
        }
        return $title;
    }

    /**
     * Filter in-page title for mentor profiles.
     */
    public static function filter_page_title(string $title, int $post_id = 0): string {
        if (!in_the_loop() || !is_page()) {
            return $title;
        }
        $mentor_username = get_query_var('thotis_mentor', '');
        if (!empty($mentor_username)) {
            $profile = self::fetch_mentor_profile($mentor_username);
            if ($profile) {
                return esc_html(($profile['user']['name'] ?? $mentor_username) . ' — Mentor');
            }
        }
        return $title;
    }

    /**
     * Fetch mentor profile from the API (cached for 5 minutes).
     */
    private static function fetch_mentor_profile(string $username): ?array {
        // Validate username format to prevent injection in URL
        if (!preg_match('/^[a-zA-Z0-9_-]{1,100}$/', $username)) {
            return null;
        }

        $cache_key = 'thotis_mentor_' . sanitize_key($username);
        $cached = get_transient($cache_key);
        if ($cached !== false) {
            return $cached;
        }

        $api_url = Thotis_Mentoring::api_url();
        $response = wp_remote_get($api_url . '/mentors/' . urlencode($username), [
            'timeout' => 5,
            'headers' => ['Accept' => 'application/json'],
        ]);

        if (is_wp_error($response)) {
            error_log('[Thotis SEO] API request failed for mentor "' . $username . '": ' . $response->get_error_message());
            return null;
        }

        $status_code = wp_remote_retrieve_response_code($response);
        if ($status_code !== 200) {
            error_log('[Thotis SEO] API returned status ' . $status_code . ' for mentor "' . $username . '"');
            return null;
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);

        // Validate response structure before caching
        if (!is_array($body) || !isset($body['profile']) || !is_array($body['profile'])) {
            error_log('[Thotis SEO] Invalid API response structure for mentor "' . $username . '"');
            return null;
        }

        $profile = $body['profile'];

        // Ensure required nested structure exists
        if (!isset($profile['user']) || !is_array($profile['user'])) {
            error_log('[Thotis SEO] Missing user data in profile for mentor "' . $username . '"');
            return null;
        }

        set_transient($cache_key, $profile, 5 * MINUTE_IN_SECONDS);

        return $profile;
    }
}
