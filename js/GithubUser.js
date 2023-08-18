export class GuithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    return fetch(endpoint)
      .then((data) => data.json())
      .then((data) => {
        const { login, name, followers, public_repos } = data;
        return { login, name, followers, public_repos };
      });
  }
}
