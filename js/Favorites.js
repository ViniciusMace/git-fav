import { GuithubUser } from "./GithubUser.js";

class Favorites {
  constructor(root) {
    this.root = root;
    this.load();
  }

  save() {
    localStorage.setItem("@github-gitfav:", JSON.stringify(this.entries));
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-gitfav:")) || [];
  }

  async add(username) {
    try {
      const userExist = this.entries.find(
        (entrie) => entrie.login.toLowerCase() === username.toLowerCase()
      );

      if (userExist) {
        throw new Error("Usuário já favoritado.");
      }

      const user = await GuithubUser.search(username);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado.");
      }

      this.entries = [user, ...this.entries];
      this.save();
      this.update();
    } catch (error) {
      alert(error.message);
    }
  }

  remove(username) {
    console.log(username);
    const filteredEntry = this.entries.filter((entry) => {
      return entry.login.toLowerCase() !== username.toLowerCase();
    });

    this.entries = [...filteredEntry];
    this.save();
    this.update();
  }
}

export class FavoritesViews extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = document.querySelector("table tbody");
    this.update();
    this.onAdd();
  }

  update() {
    this.removeAllTr();

    if (this.entries[0] == undefined) {
      const empty = this.createTrEmpty();
      this.tbody.append(empty);
    }

    this.entries.forEach((user) => {
      const row = this.createTr(user);

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm(
          `Realmente deseja remover ${user.login} dos favoritos?`
        );

        if (isOk) {
          this.remove(user.login);
        }
      };

      this.tbody.append(row);
    });
  }

  onAdd() {
    const buttonSearch = document.querySelector(".search button");
    buttonSearch.onclick = () => {
      const { value } = document.querySelector("input");
      this.add(value);
    };
  }

  createTr(user) {
    const tr = document.createElement("tr");
    this.tbody.classList.remove("empty");
    tr.innerHTML = `
        <tr>
          <td>
          <div class="info-person">
            <img src="https://github.com/${user.login}.png" alt="imagem de ${user.login}" />
            <a href="https://github.com/${user.login}" target="_blank">
              <p>${user.name}</p>
              <span>/${user.login}</span>
            </a>
            </div>
          </td>
          <td>${user.public_repos}</td>
          <td>${user.followers}</td>
          <td><button class="remove">Remover</button></td>
        </tr>
  `;
    return tr;
  }

  createTrEmpty() {
    const trEmpty = document.createElement("tr");
    this.tbody.classList.add("empty");
    trEmpty.innerHTML = `
    <tr>
        <td colspan="4"> 
          <div class="content-empty">
            <img src="./assets/Estrela.svg" alt="">
              <h2>Nenhum favorito ainda</h2>
            </div>
        </td>
    </tr>`;

    return trEmpty;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((element) => {
      element.remove();
    });
  }
}
