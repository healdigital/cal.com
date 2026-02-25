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
                $name = esc_attr($profile['user']['name'] ?? $mentor_username);
                $bio = esc_attr(wp_trim_words($profile['bio'] ?? '', 30));
                $university = esc_attr($profile['university'] ?? '');
                $photo = esc_url($profile['profilePhotoUrl'] ?? '');

                echo '<meta name="description" content="' . $name . ' — Mentor ' . $university . '. ' . $bio . '" />' . "\n";
                echo '<meta property="og:title" content="' . $name . ' | Mentorat Thotis" />' . "\n";
                echo '<meta property="og:description" content="' . $bio . '" />' . "\n";
                echo '<meta property="og:type" content="profile" />' . "\n";
                if ($photo) {
                    echo '<meta property="og:image" content="' . $photo . '" />' . "\n";
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
            echo '<meta name="description" content="Trouvez le mentor idéal pour votre orientation. Parcourez nos profils de mentors étudiants et réservez une session gratuite de 15 minutes." />' . "\n";
            echo '<meta property="og:title" content="Nos Mentors | Thotis Media" />' . "\n";
            echo '<meta property="og:description" content="Trouvez le mentor idéal parmi nos étudiants ambassadeurs." />' . "\n";
        }

        if (has_shortcode($post->post_content, 'thotis_landing')) {
            echo '<meta name="description" content="Thotis Mentorat — Échangez avec des étudiants de grandes écoles et universités pour votre orientation post-bac." />' . "\n";
            echo '<meta property="og:title" content="Mentorat Étudiant | Thotis Media" />' . "\n";
            echo '<meta property="og:description" content="Réservez un appel gratuit de 15 minutes avec un étudiant mentor." />' . "\n";
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
                $title['title'] = $name . ' — Mentor Thotis';
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

        if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
            return null;
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);
        $profile = $body['profile'] ?? null;

        if ($profile) {
            set_transient($cache_key, $profile, 5 * MINUTE_IN_SECONDS);
        }

        return $profile;
    }
}
