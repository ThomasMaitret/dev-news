fetch("https://www.reddit.com/r/angular2/hot.json")
  .then(response => response.json())
  .then(posts => {
    const fragment = document.createDocumentFragment();
    const ul = document.querySelector(".ul");
    Object.values(posts.data.children).forEach(post => {
      const li = document.createElement("li");

      const a = document.createElement("a");
      a.textContent = post.data.title;
      a.href = post.data.url;
      a.target = "_blank";
      a.rel = "noopener";

      const span = document.createElement("span");
      span.textContent = ` (${post.data.domain})`;

      li.appendChild(a);
      li.appendChild(span);

      li.appendChild(document.createElement("br"));

      const date = document.createElement("span");
      date.textContent = new Date(
        post.data.created * 1000
      ).toLocaleDateString();
      date.classList.add("date");

      const subreddit = document.createElement("span");
      subreddit.classList.add("subreddit");
      subreddit.textContent = post.data.subreddit;

      li.appendChild(subreddit);
      li.append(" • ");
      li.appendChild(date);

      fragment.appendChild(li);
    });
    ul.textContent = null;
    document.querySelector(".container").append(fragment);
  })
  .catch(error => {
    throw new Error(error);
  });
