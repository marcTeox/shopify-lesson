const button = document.querySelector("[data-render]");

button.addEventListener("click", () => {
  fetch(`${window.Shopify.routes.root}?sections=rich-text`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    });
});
