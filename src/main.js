"use strict";

const subreddits = [
  "angular2",
  "node",
  "javascript",
  "webdev",
  "frontend",
  "coding",
  "css",
  "html5",
];

const currentTheme = localStorage.getItem("theme") || null;
if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
}

document.querySelector(".theme-switcher").addEventListener(
  "click",
  () => {
    const theme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  },
  { passive: true }
);

(async () => {
  try {
    const listings = [];

    await Promise.all(
      subreddits.map(async (sub) => {
        const response = await fetch(
          `https://www.reddit.com/r/${sub}/hot.json?limit=5`
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

const appendListingsToDOM = (listings) => {
  const fragment = document.createDocumentFragment();

  const posts = getSortedPostsFromListings(listings);

  posts.forEach((data) => {
    const link = document.createElement("a");
    link.textContent = data.title;
    link.href = data.url;
    link.target = "_blank";
    link.rel = "noopener";

    const domain = document.createElement("span");
    domain.textContent = ` (${data.domain})`;

    const date = document.createElement("span");
    date.textContent = new Date(data.created * 1000).toLocaleDateString();

    const subreddit = document.createElement("span");
    subreddit.classList.add("subreddit");
    subreddit.textContent = data.subreddit;

    const icon = document.createElement("img");
    icon.alt = `${data.domain}`;
    icon.loading = "lazy";
    const domainURL = data.domain.startsWith("self.")
      ? "reddit.com"
      : data.domain;
    icon.src = `https://www.google.com/s2/favicons?domain_url=${domainURL}&sz=16`;
    icon.classList.add("site-icon");

    const li = document.createElement("li");
    li.appendChild(icon);
    li.appendChild(link);
    li.appendChild(domain);
    li.appendChild(document.createElement("br"));
    li.appendChild(subreddit);
    li.append(" • ");
    li.appendChild(date);

    fragment.appendChild(li);
  });

  document.querySelector(".posts").append(fragment);
};

const getSortedPostsFromListings = (listings) => {
  const posts = listings.reduce((array, listing) => {
    array.push(
      ...Object.values(listing.data.children).map((item) => item.data)
    );
    return array;
  }, []);

  const uniquePosts = posts.reduce((array, currentPost) => {
    const x = array.find((post) => post.url === currentPost.url);
    if (!x) return array.concat([currentPost]);
    return array;
  }, []);

  const sortedPosts = uniquePosts.sort(
    (a, b) => new Date(b.created * 1000) - new Date(a.created * 1000)
  );

  return sortedPosts;
};
