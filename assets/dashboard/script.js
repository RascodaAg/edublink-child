/**
 * Dashboard — Remix Icon Replacement & Enhancements
 * LearnSimply (beta.learrnsimply.com)
 *
 * Replaces broken Tutor LMS tutor-icon-* sidebar icons with
 * modern Remix Icons (remixicon.com) loaded via CDN.
 *
 * Also enhances:
 *  - Stat card icons on the dashboard home
 *  - Mobile footer nav icons
 *  - Star rating icons
 */

(function ($) {
    'use strict';

    /* ======================================================================
       1. SIDEBAR NAV ICON MAP
       Maps <li> class suffix → Remix Icon class
       ====================================================================== */
    var sidebarIconMap = {
        'index':             'ri-dashboard-line',
        'my-profile':        'ri-user-3-line',
        'enrolled-courses':  'ri-book-open-line',
        'my-courses':        'ri-graduation-cap-line',
        'reviews':           'ri-star-line',
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
       3. REPLACE SIDEBAR NAV ICONS
       ====================================================================== */
    function replaceSidebarIcons() {
        var $menuItems = $('.tutor-dashboard-permalinks .tutor-dashboard-menu-item');

        $menuItems.each(function () {
            var $li = $(this);
            var classList = ($li.attr('class') || '').split(/\s+/);
            var slug = '';

            // Extract slug from class like "tutor-dashboard-menu-{slug}"
            for (var i = 0; i < classList.length; i++) {
                var match = classList[i].match(/^tutor-dashboard-menu-(.+)$/);
                if (match && match[1] !== 'item' && match[1] !== 'divider' && match[1] !== 'divider-header') {
                    slug = match[1];
                    break;
                }
            }

            if (!slug || !sidebarIconMap[slug]) return;

            var remixClass = sidebarIconMap[slug];
            var $iconSpan = $li.find('.tutor-dashboard-menu-item-icon');

            if ($iconSpan.length) {
                // Replace the icon element entirely
                var $newIcon = $('<i></i>')
                    .addClass(remixClass)
                    .addClass('tutor-dashboard-menu-item-icon')
                    .addClass('ri-icon-replaced');
                $iconSpan.replaceWith($newIcon);
            } else {
                // No icon span exists — prepend one inside the <a> link
                var $link = $li.find('a, .tutor-dashboard-menu-item-link').first();
                if ($link.length) {
                    var $newIcon = $('<i></i>')
                        .addClass(remixClass)
                        .addClass('tutor-dashboard-menu-item-icon')
                        .addClass('ri-icon-replaced');
                    $link.prepend($newIcon);
                }
            }
        });
    }

    /* ======================================================================
       4. REPLACE ALL OTHER TUTOR-ICON-* ELEMENTS
       ====================================================================== */
    function replaceGenericIcons() {
        // Find all elements with tutor-icon-* classes inside the dashboard
        var $dashboard = $('.tutor-wrap.tutor-dashboard');
        if (!$dashboard.length) return;

        // Don't re-replace sidebar icons (already handled)
        var $icons = $dashboard.find('[class*="tutor-icon-"]').not('.ri-icon-replaced').not('.tutor-dashboard-menu-item-icon');

        $icons.each(function () {
            var $el = $(this);
            var classList = ($el.attr('class') || '').split(/\s+/);

            for (var i = 0; i < classList.length; i++) {
                if (statIconMap[classList[i]]) {
                    var remixClass = statIconMap[classList[i]];
                    // Remove the old tutor-icon class, add remix class
                    $el.removeClass(classList[i]).addClass(remixClass).addClass('ri-icon-replaced');
                    // Ensure correct font-family
                    $el.css({
                        'font-family': 'remixicon',
                        'font-style': 'normal',
                        '-webkit-font-smoothing': 'antialiased',
                        '-moz-osx-font-smoothing': 'grayscale'
                    });
                    break; // one replacement per element
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
            'tutor-icon-dashboard':     'ri-dashboard-line',
            'tutor-icon-book-open':     'ri-book-open-line',
            'tutor-icon-question':      'ri-question-answer-line',
            'tutor-icon-quiz-attempt':  'ri-file-list-3-line',
            'tutor-icon-hamburger-o':   'ri-menu-line'
        };

        $footer.find('[class*="tutor-icon-"]').each(function () {
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
        $('.tutor-dashboard-permalinks .tutor-dashboard-menu-item a').on('click', function () {
            // Scroll content area to top when switching pages
            if (window.innerWidth <= 991) {
                $('html, body').animate({ scrollTop: 0 }, 300);
            }
        });
    }

    /* ======================================================================
       7. INIT — RUN ON DOM READY
       ====================================================================== */
    $(document).ready(function () {
        // Verify we're on the dashboard
        if (!$('.tutor-wrap.tutor-dashboard').length) return;

        // Wait a tiny bit for Tutor LMS to finish rendering dynamic content
        setTimeout(function () {
            replaceSidebarIcons();
            replaceGenericIcons();
            replaceMobileFooterIcons();
            enhanceSidebarNav();
        }, 100);

        // Also observe for AJAX-loaded content (Tutor LMS uses AJAX for some pages)
        if (typeof MutationObserver !== 'undefined') {
            var contentArea = document.querySelector('.tutor-dashboard-content');
            if (contentArea) {
                var observer = new MutationObserver(function (mutations) {
                    // Re-run generic icon replacements when content changes
                    replaceGenericIcons();
                });
                observer.observe(contentArea, {
                    childList: true,
                    subtree: true
                });
            }
        }
    });

})(jQuery);
