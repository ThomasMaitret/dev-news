const subreddits = [
  "angular2",
  "vuejs",
  "node",
  "javascript",
  "webdev",
  "frontend",
  "coding",
  "css",
  "html5"
];

(async () => {
  try {
    const listings = [];

    await Promise.all(
      subreddits.map(async sub => {
        const response = await fetch(
          `https://www.reddit.com/r/${sub}/hot.json`
        );
        const listing = await response.json();
        listings.push(listing);
      })
    );

    appendListingsToDOM(listings);
  } catch (error) {
    throw new Error(error);
  }
})();

appendListingsToDOM = listings => {
  const fragment = document.createDocumentFragment();

  const posts = getSortedPostsFromListings(listings);

  posts.forEach(data => {
    const link = document.createElement("a");
    link.textContent = data.title;
    link.href = data.url;
    link.target = "_blank";
    link.rel = "noopener";

    const domain = document.createElement("span");
    domain.textContent = ` (${data.domain})`;

    const date = document.createElement("span");
    date.textContent = new Date(data.created * 1000).toLocaleDateString();
    date.classList.add("date");

    const subreddit = document.createElement("span");
    subreddit.classList.add("subreddit");
    subreddit.textContent = data.subreddit;

    const li = document.createElement("li");
    li.appendChild(link);
    li.appendChild(domain);
    li.appendChild(document.createElement("br"));
    li.appendChild(subreddit);
    li.append(" • ");
    li.appendChild(date);

    fragment.appendChild(li);
  });

  document.querySelector(".ul").textContent = null;
  document.querySelector(".container").append(fragment);
};

getSortedPostsFromListings = listings => {
  return listings
    .reduce((array, listing) => {
      array.push(
        ...Object.values(listing.data.children).map(item => item.data)
      );
      return array;
    }, [])
    .sort((a, b) => new Date(b.created * 1000) - new Date(a.created * 1000));
};
