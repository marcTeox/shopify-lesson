class QuickView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.content = this.querySelector(".quick-view__content");

    // Use event delegation so dynamically re-rendered elements (pagination etc.) still open quick view.
    this._boundDocumentClick = this._handleDocumentClick.bind(this);
    document.addEventListener("click", this._boundDocumentClick);

    // Close button is part of this element; bind and keep a reference to remove later
    this.closeButton = this.querySelector("[data-close]");
    if (this.closeButton) {
      this._boundClose = this.closeDrawer.bind(this);
      this.closeButton.addEventListener("click", this._boundClose);
    }
  }

  disconnectedCallback() {
    // Clean up delegated listener and any local listeners
    if (this._boundDocumentClick)
      document.removeEventListener("click", this._boundDocumentClick);
    if (this.closeButton && this._boundClose)
      this.closeButton.removeEventListener("click", this._boundClose);
  }

  _handleDocumentClick(event) {
    // Find the closest opener for the click target. This handles elements added later by pagination.
    const opener = event.target.closest("[data-quick-view]");
    if (!opener) return;

    // If the opener is inside this quick-view element itself, ignore (prevent self-handling)
    if (this.contains(opener)) return;

    // Prevent default link behavior where applicable
    if (event.target.tagName === "A" || opener.tagName === "A")
      event.preventDefault();

    // Call the existing openQuickView method with a minimal event-like object
    this.openQuickView({ currentTarget: opener, preventDefault: () => {} });
  }
  openQuickView(event) {
    const opener = event.currentTarget;

    console.log("Opening quick view");
    const productHandle = opener.getAttribute("data-product-handle");
    const productUrl = `${window.Shopify.routes.root}products/${productHandle}/?section_id=product-render`;

    // Insert a simple loading indicator while the fetch is in progress
    const loadingHtml = `
      <div class="quick-view__loading" aria-live="polite" style="padding:24px;display:flex;align-items:center;gap:12px;justify-content:center;">
        <svg width="20" height="20" viewBox="0 0 50 50" aria-hidden="true" focusable="false">
          <circle cx="25" cy="25" r="20" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="31.4 31.4">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
        <span class="quick-view__loading-text">Loading…</span>
      </div>`;

    // show loader and disable opener for accessibility
    this.content.innerHTML = loadingHtml;
    opener.setAttribute("aria-disabled", "true");
    this.openDrawer();

    fetch(productUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        // Prefer to extract the quick-view section content if present
        const extracted =
          tempDiv.querySelector(".product-render") ||
          tempDiv.querySelector(".product") ||
          tempDiv.body ||
          tempDiv;
        this.content.innerHTML = extracted
          ? extracted.innerHTML
          : tempDiv.innerHTML;
      })
      .catch((error) => {
        console.error("Error loading product:", error);
        this.content.innerHTML = `<div class="quick-view__error" style="padding:24px;text-align:center;color:#c00;">Failed to load product. Please try again.</div>`;
      })
      .finally(() => {
        opener.removeAttribute("aria-disabled");
      });
  }

  openDrawer() {
    this.setAttribute("open", "");
  }

  closeDrawer() {
    this.removeAttribute("open");
  }
}

customElements.define("quick-view", QuickView);
