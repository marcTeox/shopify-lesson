class CollectionFilters extends HTMLElement {
  constructor() {
    super();
  }
  get sectionId() {
    return this.dataset.sectionId;
  }
  connectedCallback() {
    this.filterOptions = this.querySelectorAll("input[type='checkbox']");
    this.filterOptions.forEach((option) => {
      option.addEventListener("change", this.onFilterChange.bind(this));
    });
  }
  onFilterChange(event) {
    const url = event.currentTarget.checked
      ? new URL(event.currentTarget.dataset.addUrl, window.location.origin)
      : new URL(event.currentTarget.dataset.removeUrl, window.location.origin);
    url.searchParams.set("sections", this.sectionId);
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .then((html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html[this.sectionId];
        console.log(tempDiv);
        const collectionBody = tempDiv.querySelector("[data-collection-body]");
        document.querySelector("[data-collection-body]").innerHTML =
          collectionBody.innerHTML;
        url.searchParams.delete("section_id");
        window.history.pushState({}, "", url.toString());
      });
  }
}

customElements.define("collection-filter", CollectionFilters);
