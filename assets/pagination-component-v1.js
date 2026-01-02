class PaginationComponentV1 extends HTMLElement {
  constructor() {
    super();
  }

  get sectionId() {
    return this.dataset.sectionId;
  }
  connectedCallback() {
    this.links = this.querySelectorAll("span a");
    this.links.forEach((link) => {
      link.addEventListener("click", this.handlePagination.bind(this));
    });
  }

  handlePagination(event) {
    event.preventDefault();
    const url = new URL(event.currentTarget.href);
    url.searchParams.set("sections", this.sectionId);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = data[this.sectionId];
        const paginationData = tempDiv.querySelector("[data-collection-main]");
        document.querySelector("[data-collection-main]").innerHTML =
          paginationData.innerHTML;
        url.searchParams.delete("sections");
        console.log(url.href);
        window.history.pushState({}, "", url);
      });
  }
}

customElements.define("pagination-componentv1", PaginationComponentV1);
