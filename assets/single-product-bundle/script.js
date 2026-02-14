/**
 * Single Product Bundle Page JavaScript
 * Handles interactive functionality for the bundle product page
 */

document.addEventListener("DOMContentLoaded", function () {
	// Handle review form submit loading state
	const reviewForms = document.querySelectorAll(".add-review-section form");
	reviewForms.forEach((form) => {
		form.addEventListener("submit", function () {
			const submitBtn =
				form.querySelector('button[type="submit"]') ||
				form.querySelector('input[type="submit"]');
			if (!submitBtn) return;

			if (!submitBtn.dataset.originalText) {
				submitBtn.dataset.originalText = submitBtn.textContent;
          }

			submitBtn.classList.add("is-loading");
			submitBtn.disabled = true;
      });
    });

	// Custom star rating behavior for review form (hover + click to select)
	const starWrappers = document.querySelectorAll(
		".add-review-section p.stars"
	);
	starWrappers.forEach((wrapper) => {
		const stars = wrapper.querySelectorAll("a");
		const form = wrapper.closest("form");
		if (!form || stars.length === 0) return;

		const ratingSelect = form.querySelector("#rating");
		let currentRating = parseInt(ratingSelect?.value || "0", 10) || 0;

		const applyVisual = (value) => {
			stars.forEach((star, index) => {
				if (index < value) {
					star.classList.add("is-active");
        } else {
					star.classList.remove("is-active");
        }
      });
		};

		// Initial state
		if (currentRating > 0) {
			applyVisual(currentRating);
		}

		stars.forEach((star, index) => {
			const value = index + 1;

			star.addEventListener("mouseenter", () => {
				applyVisual(value);
			});

			star.addEventListener("mouseleave", () => {
				applyVisual(currentRating);
    });

			star.addEventListener("click", (e) => {
      e.preventDefault();
				currentRating = value;
				if (ratingSelect) {
					ratingSelect.value = String(currentRating);
				}
				applyVisual(currentRating);
      });
        });
      });

	// Description card expand/collapse functionality
	const showMoreBtn = document.querySelector(".show-more-btn");
	const descriptionCard = document.querySelector(".description-card");
	
	if (showMoreBtn && descriptionCard) {
		showMoreBtn.addEventListener("click", function () {
			const isExpanded = descriptionCard.classList.contains("expanded");
			
			if (isExpanded) {
				descriptionCard.classList.remove("expanded");
				this.textContent = "عرض المزيد";
    } else {
				descriptionCard.classList.add("expanded");
				this.textContent = "عرض أقل";
          }
        });
	}
});

// Share product function
function shareProduct() {
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
				alert("تم نسخ رابط المنتج!");
			},
			() => {
				alert("فشل نسخ الرابط");
    }
		);
  }
}
