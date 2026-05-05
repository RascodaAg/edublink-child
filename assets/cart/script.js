/**
 * Cart Page — Interactions
 * Handles both WooCommerce and Tutor LMS cart item removal with smooth animation.
 */
(function ($) {
    "use strict";

    $(document).ready(function () {

        // ─── 1. WooCommerce: Remove item (.lc-item__remove) ───
        $(document).on("click", ".lc-item__remove", function (e) {
            var $link = $(this);
            var href  = $link.attr("href");

            // If it's a link (WooCommerce), animate then navigate
            if (href && href !== "javascript:void(0)" && href !== "#") {
                e.preventDefault();
                var $item = $link.closest(".lc-item");

                // Animate out
                $item.addClass("is-removing");
                setTimeout(function () {
                    $item.addClass("is-collapsed");
                }, 260);

                // Navigate after animation
                setTimeout(function () {
                    window.location.href = href;
                }, 480);
            }
            // If it's not a link, it might be handled by another script or it's a button
        });

        // ─── 2. Tutor LMS: Remove item button (.custom-remove-item-btn) ───
        $(document).on("click", ".custom-remove-item-btn", function (e) {
            e.preventDefault();

            var $btn = $(this);
            var $item = $btn.closest(".custom-cart-item");
            if (!$item.length) {
                $item = $btn.closest(".lc-item");
            }
            var courseId = $btn.data("course-id");

            if (!courseId) return;

            // Disable button and show loading
            $btn.prop("disabled", true).css("opacity", "0.5");

            // Animate out
            $item.css({
                transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                opacity: "0",
                transform: "translateX(30px) scale(0.97)",
                maxHeight: $item.outerHeight() + "px",
                overflow: "hidden",
            });

            setTimeout(function () {
                $item.css({
                    maxHeight: "0",
                    padding: "0",
                    margin: "0",
                    borderWidth: "0",
                });
            }, 250);

            // Send AJAX request (Tutor LMS cart removal)
            $.ajax({
                url: window._tutorobject ? window._tutorobject.ajaxurl : "/wp-admin/admin-ajax.php",
                type: "POST",
                data: {
                    action: "tutor_cart_remove_item",
                    course_id: courseId,
                    _tutor_nonce: window._tutorobject ? window._tutorobject.nonce : "",
                },
                success: function () {
                    setTimeout(function () {
                        $item.remove();
                        updateCartCount();
                    }, 400);
                },
                error: function () {
                    // Revert animation on error
                    $item.css({
                        opacity: "1",
                        transform: "none",
                        maxHeight: "",
                        padding: "",
                        margin: "",
                        borderWidth: "",
                    });
                    $btn.prop("disabled", false).css("opacity", "1");
                },
            });
        });

        // ─── 3. WooCommerce: Default table remove buttons (×) ───
        $(document).on("click", "table.shop_table td.product-remove a.remove", function () {
            var $row = $(this).closest("tr");
            $row.css({
                transition: "opacity 0.3s, transform 0.3s",
                opacity: "0",
                transform: "translateX(20px)",
            });
        });

        /**
         * Update cart count after removal (for Tutor LMS AJAX)
         */
        function updateCartCount() {
            var remaining = $(".custom-cart-item, .lc-item").length;
            if (remaining === 0) {
                // Reload for empty state
                location.reload();
            } else {
                var text = remaining + (remaining === 1 ? " دورة في السلة" : " دورات في السلة");
                $(".custom-cart-count, .lc-cart-hero__count").text(text);
            }
        }

    });
})(jQuery);
