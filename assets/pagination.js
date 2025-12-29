class PaginationComponent extends HTMLElement {
  constructor() {
    super();
  }
  get sectionId() {
    return this.dataset.sectionId;
  }
  connectedCallback() {
    this.links = this.querySelectorAll("span a");
    this.links.forEach((link) => {
      link.addEventListener("click", this.handlePaginationButton.bind(this));
    });
  }

  handlePaginationButton(event) {
    event.preventDefault();
    const url = new URL(event.currentTarget.href);
    url.searchParams.set("sections", this.sectionId);

    fetch(url.toString())
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = data[this.sectionId];
        document.querySelector("[data-collection-main]").innerHTML =
          tempDiv.querySelector("[data-collection-list]").innerHTML;

        url.searchParams.delete("sections");
        window.history.pushState({}, "", url.toString());
      });
  }
}

customElements.define("pagination-component", PaginationComponent);
