/**
 * Dashboard — Remix Icon Injection & Enhancements
 * LearnSimply (beta.learrnsimply.com)
 *
 * Injects Remix Icons into the Tutor LMS sidebar navigation.
 * Uses a guaranteed-injection strategy (removes any broken existing
 * icon spans and always creates fresh <i> elements), with 4 retry
 * timers to handle Tutor LMS AJAX-rendered pages.
 *
 * Also enhances:
 *  - Stat card icons on the dashboard home
 *  - Mobile footer nav icons
 */

(function ($) {
    'use strict';

    /* ======================================================================
       1. SIDEBAR NAV ICON MAP
       Maps <li> class suffix → Remix Icon class
       ====================================================================== */
    var sidebarIconMap = {
        'index':             'ri-dashboard-3-line',
        'my-profile':        'ri-user-3-line',
        'enrolled-courses':  'ri-book-open-line',
        'my-courses':        'ri-graduation-cap-line',
        'reviews':           'ri-star-half-line',
        'my-quiz-attempts':  'ri-file-list-3-line',
        'wishlist':          'ri-heart-3-line',
        'purchase_history':  'ri-receipt-line',
        'question-answer':   'ri-question-answer-line',
        'settings':          'ri-settings-3-line',
        'logout':            'ri-logout-circle-r-line',
        // Instructor-specific pages
        'create-course':     'ri-add-circle-line',
        'announcements':     'ri-megaphone-line',
        'withdraw':          'ri-money-dollar-circle-line',
        'earning':           'ri-bar-chart-box-line',
        'assignments':       'ri-task-line',
        'certificate':       'ri-award-line'
    };

    /* ======================================================================
       2. STAT CARD ICON MAP
       Maps Tutor LMS icon classes → Remix Icon classes
       ====================================================================== */
    var statIconMap = {
        'tutor-icon-book-open':     'ri-book-open-line',
        'tutor-icon-mortarboard-o': 'ri-graduation-cap-line',
        'tutor-icon-trophy':        'ri-trophy-line',
        'tutor-icon-box-open':      'ri-archive-line',
        'tutor-icon-user-graduate': 'ri-user-star-line',
        'tutor-icon-coins':         'ri-coins-line',
        'tutor-icon-star-bold':     'ri-star-fill',
        'tutor-icon-star-line':     'ri-star-line',
        'tutor-icon-receipt-line':  'ri-receipt-line',
        'tutor-icon-question':      'ri-question-line',
        'tutor-icon-quiz-attempt':  'ri-file-list-3-line',
        'tutor-icon-dashboard':     'ri-dashboard-line',
        'tutor-icon-hamburger-o':   'ri-menu-line',
        'tutor-icon-times':         'ri-close-line',
        'tutor-icon-circle-mark-line':  'ri-checkbox-circle-line',
        'tutor-icon-circle-times-line': 'ri-close-circle-line',
        'tutor-icon-circle-info':   'ri-information-line',
        'tutor-icon-user-bold':     'ri-user-line',
        'tutor-icon-bell':          'ri-notification-3-line',
        'tutor-icon-eye-bold':      'ri-eye-line',
        'tutor-icon-eye-slash':     'ri-eye-off-line',
        'tutor-icon-pencil':        'ri-edit-line',
        'tutor-icon-trash':         'ri-delete-bin-line',
        'tutor-icon-download':      'ri-download-line',
        'tutor-icon-upload':        'ri-upload-line',
        'tutor-icon-search':        'ri-search-line',
        'tutor-icon-plus':          'ri-add-line',
        'tutor-icon-minus':         'ri-subtract-line',
        'tutor-icon-check':         'ri-check-line',
        'tutor-icon-arrow-left':    'ri-arrow-right-line',   // RTL: left → right
        'tutor-icon-arrow-right':   'ri-arrow-left-line',    // RTL: right → left
        'tutor-icon-chevron-left':  'ri-arrow-right-s-line', // RTL
        'tutor-icon-chevron-right': 'ri-arrow-left-s-line',  // RTL
        'tutor-icon-angle-left':    'ri-arrow-right-s-line', // RTL
        'tutor-icon-angle-right':   'ri-arrow-left-s-line',  // RTL
        'tutor-icon-play':          'ri-play-line',
        'tutor-icon-calendar':      'ri-calendar-line',
        'tutor-icon-clock':         'ri-time-line',
        'tutor-icon-location':      'ri-map-pin-line',
        'tutor-icon-link':          'ri-link',
        'tutor-icon-share':         'ri-share-line',
        'tutor-icon-lock':          'ri-lock-line',
        'tutor-icon-unlock':        'ri-lock-unlock-line',
        'tutor-icon-camera':        'ri-camera-line',
        'tutor-icon-image':         'ri-image-line',
        'tutor-icon-video':         'ri-video-line',
        'tutor-icon-file':          'ri-file-line',
        'tutor-icon-folder':        'ri-folder-line',
        'tutor-icon-attachment':    'ri-attachment-line',
        'tutor-icon-gear':          'ri-settings-3-line',
        'tutor-icon-cog':           'ri-settings-3-line'
    };

    /* ======================================================================
       3. REPLACE SIDEBAR NAV ICONS — guaranteed injection strategy
       Always removes any existing broken icon element and injects a fresh
       <i> tag, so icons appear regardless of Tutor LMS rendering quirks.
       Marks processed <li> with data-ri="done" to avoid duplicates.
       ====================================================================== */
    function replaceSidebarIcons() {
        var $menuItems = $('.tutor-dashboard-permalinks .tutor-dashboard-menu-item:not([data-ri="done"])');
        if (!$menuItems.length) return;

        $menuItems.each(function () {
            var $li = $(this);
            var classList = ($li.attr('class') || '').split(/\s+/);
            var slug = '';

            for (var i = 0; i < classList.length; i++) {
                var match = classList[i].match(/^tutor-dashboard-menu-(.+)$/);
                if (match && match[1] !== 'item' && match[1] !== 'divider' && match[1] !== 'divider-header') {
                    slug = match[1];
                    break;
                }
            }

            if (!slug || !sidebarIconMap[slug]) return;

            var remixClass = sidebarIconMap[slug];
            var $link = $li.find('a, .tutor-dashboard-menu-item-link').first();
            if (!$link.length) return;

            // Always remove existing icon elements (broken or not)
            $link.find('.tutor-dashboard-menu-item-icon, [class*="tutor-icon-"], [class*="ri-"]').remove();

            // Inject a fresh Remix Icon <i> at the start of the link
            var $icon = $('<i></i>')
                .addClass(remixClass)
                .addClass('tutor-dashboard-menu-item-icon')
                .addClass('ri-icon-replaced')
                .attr('aria-hidden', 'true');

            $link.prepend($icon);
            $li.attr('data-ri', 'done');
        });
    }

    /* ======================================================================
       4. REPLACE ALL OTHER TUTOR-ICON-* ELEMENTS
       ====================================================================== */
    function replaceGenericIcons() {
        var $dashboard = $('.tutor-wrap.tutor-dashboard');
        if (!$dashboard.length) return;

        var $icons = $dashboard.find('[class*="tutor-icon-"]:not(.ri-icon-replaced):not(.tutor-dashboard-menu-item-icon)');

        $icons.each(function () {
            var $el = $(this);
            var classList = ($el.attr('class') || '').split(/\s+/);

            for (var i = 0; i < classList.length; i++) {
                if (statIconMap[classList[i]]) {
                    var remixClass = statIconMap[classList[i]];
                    $el.removeClass(classList[i]).addClass(remixClass).addClass('ri-icon-replaced');
                    break;
                }
            }
        });
    }

    /* ======================================================================
       5. REPLACE MOBILE FOOTER NAV ICONS
       ====================================================================== */
    function replaceMobileFooterIcons() {
        var $footer = $('#tutor-dashboard-footer-mobile');
        if (!$footer.length) return;

        var mobileMap = {
            'tutor-icon-dashboard':     'ri-dashboard-3-line',
            'tutor-icon-book-open':     'ri-book-open-line',
            'tutor-icon-question':      'ri-question-answer-line',
            'tutor-icon-quiz-attempt':  'ri-file-list-3-line',
            'tutor-icon-hamburger-o':   'ri-menu-line'
        };

        $footer.find('[class*="tutor-icon-"]:not(.ri-icon-replaced)').each(function () {
            var $el = $(this);
            var classList = ($el.attr('class') || '').split(/\s+/);
            for (var i = 0; i < classList.length; i++) {
                if (mobileMap[classList[i]]) {
                    $el.removeClass(classList[i]).addClass(mobileMap[classList[i]]).addClass('ri-icon-replaced');
                    break;
                }
            }
        });
    }

    /* ======================================================================
       6. ENHANCE — ADD SMOOTH SCROLL TO TOP ON NAV CLICK
       ====================================================================== */
    function enhanceSidebarNav() {
        // Use event delegation so it works after AJAX re-renders
        $(document).off('click.lsNav').on('click.lsNav', '.tutor-dashboard-permalinks .tutor-dashboard-menu-item a', function () {
            if (window.innerWidth <= 991) {
                $('html, body').animate({ scrollTop: 0 }, 300);
            }
        });
    }

    /* ======================================================================
       7. RUN ALL — fires sidebar + generic + mobile in one shot
       ====================================================================== */
    function runAll() {
        if (!$('.tutor-wrap.tutor-dashboard').length) return;
        replaceSidebarIcons();
        replaceGenericIcons();
        replaceMobileFooterIcons();
    }

    /* ======================================================================
       8. INIT — 4 retry timers + MutationObserver for AJAX content
       ====================================================================== */
    $(document).ready(function () {
        if (!$('.tutor-wrap.tutor-dashboard').length) return;

        enhanceSidebarNav();

        // Fire immediately, then retry at 300ms, 800ms, 2000ms
        // to catch icons rendered late by Tutor LMS JS
        runAll();
        setTimeout(runAll, 300);
        setTimeout(runAll, 800);
        setTimeout(runAll, 2000);

        // Observe the sidebar for DOM changes (Tutor replaces it on AJAX nav)
        var sidebar = document.querySelector('.tutor-dashboard-permalinks, .tutor-dashboard-left-menu');
        if (sidebar && typeof MutationObserver !== 'undefined') {
            new MutationObserver(function () {
                // Reset done markers so icons get re-injected on the new nodes
                $('.tutor-dashboard-menu-item[data-ri="done"]').removeAttr('data-ri');
                setTimeout(runAll, 50);
            }).observe(sidebar, { childList: true, subtree: true });
        }

        // Also observe content area for AJAX sub-page changes
        var contentArea = document.querySelector('.tutor-dashboard-content');
        if (contentArea && typeof MutationObserver !== 'undefined') {
            new MutationObserver(function () {
                replaceGenericIcons();
            }).observe(contentArea, { childList: true, subtree: true });
        }
    });

})(jQuery);
