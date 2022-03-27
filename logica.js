const d = document,
  $main = d.querySelector("main");
$links = d.querySelector(".links");

let ApiPoke = "https://pokeapi.co/api/v2/pokemon/";

async function loadPokemons(url) {
  try {
    $main.innerHTML = `  <div class="loader"><i class="fas fa-spinner fa-pulse"></i></div>
    `;

    let res = await fetch(url),
      json = await res.json(),
      $template = "",
      $prevlink,
      $nextlink;

    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    for (let i = 0; i < json.results.length; i++) {
      try {
        let res = await fetch(json.results[i].url),
          pokemon = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        $template += `
           <figure class ="pokemon">
           <img src="${pokemon.sprites.front_default}" alt ="${pokemon.name}" >
           <figcaption>${pokemon.name}</figcaption>
           </figure>`;
      } catch (err) {
        let mensaje = err.statusText || "Ocurrio un error";
        $template += `
             <figure>
             <figcaption>Error ${err.status}: ${mensaje}</figcaption>
             </figure>`;
      }
    }
    $main.innerHTML = $template;
    $prevlink = json.previous
      ? `<a ><i href="${json.previous}" class="fas fa-fast-backward"></i></a>`
      : "";
    $nextlink = json.next
      ? `<a> <i class="fas fa-fast-forward" href="${json.next}"></i></a>`
      : "";

    $links.innerHTML = $prevlink + " " + $nextlink;
  } catch (err) {
    let mensaje = err.statusText || "Ocurrio un error";
    $main.innerHTML = `<p> Error ${err.status}: ${mensaje}</p>`;
  }
}
d.addEventListener("DOMContentLoaded", (e) => loadPokemons(ApiPoke));

d.addEventListener("click", (e) => {
  if (e.target.matches(".links a i")) {
    e.preventDefault();
    loadPokemons(e.target.getAttribute("href"));
  }
});
