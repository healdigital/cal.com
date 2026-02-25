<?php
/**
 * Admin settings page for Thotis Mentoring plugin.
 */

if (!defined('ABSPATH')) {
    exit;
}

class Thotis_Admin {

    public static function init(): void {
        add_action('admin_menu', [self::class, 'add_menu']);
        add_action('admin_init', [self::class, 'register_settings']);
    }

    public static function add_menu(): void {
        add_options_page(
            __('Thotis Mentoring', 'thotis-mentoring'),
            __('Thotis Mentoring', 'thotis-mentoring'),
            'manage_options',
            'thotis-mentoring',
            [self::class, 'render_page']
        );
    }

    public static function register_settings(): void {
        register_setting('thotis_mentoring', 'thotis_api_url', [
            'type'              => 'string',
            'default'           => 'https://meet.heal-digital.com/api/thotis',
            'sanitize_callback' => 'esc_url_raw',
        ]);

        add_settings_section(
            'thotis_general',
            __('Configuration générale', 'thotis-mentoring'),
            function () {
                echo '<p>' . esc_html__('Configurez la connexion au backend Thotis.', 'thotis-mentoring') . '</p>';
            },
            'thotis-mentoring'
        );

        add_settings_field(
            'thotis_api_url',
            __('URL de l\'API Thotis', 'thotis-mentoring'),
            [self::class, 'render_api_url_field'],
            'thotis-mentoring',
            'thotis_general'
        );
    }

    public static function render_api_url_field(): void {
        $value = get_option('thotis_api_url', 'https://meet.heal-digital.com/api/thotis');
        printf(
            '<input type="url" name="thotis_api_url" value="%s" class="regular-text" placeholder="https://meet.heal-digital.com/api/thotis" />',
            esc_attr($value)
        );
        echo '<p class="description">' . esc_html__('L\'URL de base de l\'API REST Thotis (sans slash final).', 'thotis-mentoring') . '</p>';
    }

    public static function render_page(): void {
        if (!current_user_can('manage_options')) {
            return;
        }
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <form action="options.php" method="post">
                <?php
                settings_fields('thotis_mentoring');
                do_settings_sections('thotis-mentoring');
                submit_button(__('Enregistrer', 'thotis-mentoring'));
                ?>
            </form>

            <hr />
            <h2><?php esc_html_e('Shortcodes disponibles', 'thotis-mentoring'); ?></h2>
            <table class="widefat striped">
                <thead>
                    <tr>
                        <th><?php esc_html_e('Shortcode', 'thotis-mentoring'); ?></th>
                        <th><?php esc_html_e('Description', 'thotis-mentoring'); ?></th>
                        <th><?php esc_html_e('Attributs', 'thotis-mentoring'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>[thotis_landing]</code></td>
                        <td><?php esc_html_e('Page d\'accueil mentorat avec formulaire d\'orientation', 'thotis-mentoring'); ?></td>
                        <td>—</td>
                    </tr>
                    <tr>
                        <td><code>[thotis_mentors]</code></td>
                        <td><?php esc_html_e('Recherche et liste des mentors', 'thotis-mentoring'); ?></td>
                        <td><code>field</code>, <code>limit</code></td>
                    </tr>
                    <tr>
                        <td><code>[thotis_mentor_profile]</code></td>
                        <td><?php esc_html_e('Profil d\'un mentor avec widget de réservation', 'thotis-mentoring'); ?></td>
                        <td><code>username</code> (ou via URL)</td>
                    </tr>
                    <tr>
                        <td><code>[thotis_sessions]</code></td>
                        <td><?php esc_html_e('Dashboard sessions de l\'élève', 'thotis-mentoring'); ?></td>
                        <td>—</td>
                    </tr>
                    <tr>
                        <td><code>[thotis_rating]</code></td>
                        <td><?php esc_html_e('Formulaire de notation post-session', 'thotis-mentoring'); ?></td>
                        <td><code>uid</code> (ou via URL)</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <?php
    }
}
