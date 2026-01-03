class QuickView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.content = this.querySelector(".quick-view__content");
    this.openButtons = document.querySelectorAll("[data-quick-view]");
    this.openButtons.forEach((button) => {
      button.addEventListener("click", this.openQuickView.bind(this));
    });
    this.closeButton = this.querySelector("[data-close]");
    this.closeButton.addEventListener("click", this.closeDrawer.bind(this));
  }
  openQuickView(event) {
    console.log("Opening quick view");
    const productHandle = event.currentTarget.getAttribute(
      "data-product-handle"
    );
    const productUrl = `${window.Shopify.routes.root}products/${productHandle}/?section_id=template--18794744217679__main`;
    console.log("Fetching product from URL:", productUrl);
    fetch(productUrl)
      .then((response) => response.text())
      .then((html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        console.log(tempDiv);
        this.content.innerHTML = tempDiv.innerHTML;
        this.showDrawer();
      })
      .catch((error) => {
        console.error("Error loading product:", error);
      });
    this.openDrawer();
  }

  openDrawer() {
    this.setAttribute("open", "");
  }

  closeDrawer() {
    this.removeAttribute("open");
  }
}

customElements.define("quick-view", QuickView);
