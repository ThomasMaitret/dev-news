"use strict";

const SUBREDDITS = [
  "angular2",
  "css",
  "frontend",
  "html5",
  "javascript",
  "node",
  "typescript",
  "webdev",
];

const getTheme = () => {
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme) {
    document.documentElement.dataset.theme = currentTheme;
  }

  document
    .querySelector(".theme-switcher")
    .addEventListener("click", switchTheme, { passive: true });
};

const switchTheme = () => {
  const theme =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
};

const getPostsFromCache = () => {
  const listings = JSON.parse(localStorage.getItem("listings"));
  if (listings) appendListingsToDOM(listings);
};

const getPosts = async () => {
  try {
    getPostsFromCache();

    const listings = await Promise.all(
      SUBREDDITS.map(async (sub) => {
        const response = await fetch(
          `https://www.reddit.com/r/${sub}/hot.json?limit=5`
        );
        return await response.json();
      })
    );

    appendListingsToDOM(listings);

    localStorage.setItem("listings", JSON.stringify(listings));
  } catch (error) {
    throw new Error(error);
  }
};

const appendListingsToDOM = (listings) => {
  const postsElement = document.querySelector(".posts");
  postsElement.innerHTML = "";

  const fragment = document.createDocumentFragment();
  const posts = getSortedPostsFromListings(listings);

  for (const data of posts) {
    const link = document.createElement("a");
    link.classList.add("link");
    link.textContent = data.title;
    link.href = data.url;
    link.target = "_blank";
    link.rel = "noopener";

    const domain = document.createElement("span");
    domain.textContent = ` (${data.domain})`;

    const date = document.createElement("span");
    date.textContent = new Date(data.created * 1000).toLocaleDateString();

    const subreddit = document.createElement("a");
    subreddit.classList.add("subreddit");
    subreddit.textContent = data.subreddit;
    subreddit.target = "_blank";
    subreddit.rel = "noopener";
    subreddit.href = `https://reddit.com${data.permalink}`;

    const icon = document.createElement("img");
    icon.alt = `${data.domain}`;
    icon.loading = "lazy";
    const domainURL = data.domain.startsWith("self.")
      ? "reddit.com"
      : data.domain;
    icon.src = `https://www.google.com/s2/favicons?domain_url=${domainURL}&sz=16`;
    icon.classList.add("site-icon");

    const li = document.createElement("li");
    li.classList.add("post");
    li.append(icon);
    li.append(link);
    li.append(domain);
    li.append(document.createElement("br"));
    li.append(subreddit);
    li.append(" • ");
    li.append(date);

    fragment.append(li);
  }

  postsElement.append(fragment);
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
    if (!x) return [...array, currentPost];
    return array;
  }, []);

  const sortedPosts = uniquePosts.sort(
    (a, b) => new Date(b.created * 1000) - new Date(a.created * 1000)
  );

  return sortedPosts;
};

getTheme();
getPosts();
