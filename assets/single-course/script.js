/**
 * Single Course Page JavaScript
 * Handles interactive functionality for the course page
 */

document.addEventListener("DOMContentLoaded", function () {
	// Course Content Card - Week Toggle Functionality
	const weekHeaders = document.querySelectorAll(".week-header");

	weekHeaders.forEach((header) => {
		header.addEventListener("click", function () {
			const weekContainer = this.parentElement;
			const isOpen = weekContainer.classList.contains("open");

			// Close all weeks first
			document.querySelectorAll(".week-container").forEach((container) => {
				container.classList.remove("open");
			});

			// Open clicked week if it wasn't open
			if (!isOpen) {
				weekContainer.classList.add("open");
			}
		});
	});

	// Show More / Show Less for Course Description
	const showMoreBtn = document.querySelector(".show-more-btn");
	if (showMoreBtn) {
		showMoreBtn.addEventListener("click", function () {
			const card = this.closest(".description-card");
			if (!card) return;

			const isExpanded = card.classList.toggle("expanded");

			// Update button text and aria attribute
			this.textContent = isExpanded ? "عرض أقل" : "عرض المزيد";
			this.setAttribute("aria-expanded", isExpanded ? "true" : "false");

			// If expanded, smoothly scroll to reveal top of card (optional)
			if (isExpanded) {
				card.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		});
	}

	// Replace all lecture-icon SVGs with the Subtract image from the project
	document.querySelectorAll("svg.lecture-icon").forEach((svg) => {
		try {
			const img = document.createElement("img");
			img.className = "lecture-icon";
			img.src = window.learnsimplyThemeUri
				? window.learnsimplyThemeUri + "/assets/img/Subtract.png"
				: "/wp-content/themes/edublink-child/assets/img/Subtract.png";
			img.alt = "أيقونة فيديو";
			svg.parentNode.replaceChild(img, svg);
		} catch (e) {
			console.warn("Failed to replace lecture svg icon", e);
		}
	});

	// Add to Cart functionality for WooCommerce products
	// No AJAX - let the link work naturally, PHP redirect will handle it
	const addToCartButtons = document.querySelectorAll(
		".add-to-cart-button"
	);
	addToCartButtons.forEach((button) => {
		// Just add loading state, don't prevent default
		button.addEventListener("click", function (e) {
			// Show loading state
			const originalText = this.textContent;
			this.textContent = "جاري الإضافة...";
			this.disabled = true;
			
			// Let the link work naturally - PHP redirect will handle the redirect
			// No preventDefault, no AJAX - simple and reliable
		});
	});
});

// Share course function
function shareCourse() {
	if (navigator.share) {
		navigator
			.share({
				title: document.title,
				text: document.querySelector(".course-title")?.textContent || "",
				url: window.location.href,
			})
			.catch((error) => {
				console.log("Error sharing:", error);
			});
	} else {
		// Fallback: copy to clipboard
		navigator.clipboard.writeText(window.location.href).then(
			() => {
				alert("تم نسخ رابط الكورس!");
			},
			() => {
				alert("فشل نسخ الرابط");
			}
		);
	}
}

// Enroll course function (for free courses)
function enrollCourse() {
	// This will be handled by Tutor LMS enrollment form
	const form = document.querySelector(".custom-enroll-form");
	if (form) {
		form.submit();
	}
}

