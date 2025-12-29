const button = document.querySelector("[data-render]");

button.addEventListener("click", () => {
  fetch(`${window.Shopify.routes.root}?sections=section-render`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = data["section-render"];
      document.querySelector(".basic-render").innerHTML =
        tempDiv.querySelector(".hero-title").textContent;
    });
});
