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
const LIMIT = 5;

function switchTheme() {
  const theme =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
}

function getPostsFromCache() {
  const listings = JSON.parse(localStorage.getItem("listings"));
  if (listings) appendListingsToDOM(listings);
}

async function getPosts() {
  try {
    const listings = await Promise.all(
      SUBREDDITS.map(async (sub) => {
        const response = await fetch(
          `https://www.reddit.com/r/${sub}/hot.json?limit=${LIMIT}`
        );
        return await response.json();
      })
    );

    appendListingsToDOM(listings);

    localStorage.setItem("listings", JSON.stringify(listings));
  } catch (error) {
    throw new Error(error);
  }
}

function appendListingsToDOM(listings) {
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
}

function getSortedPostsFromListings(listings) {
  const finalPosts = [];

  const allPosts = listings.map((listing) => listing.data.children);
  for (const posts of allPosts) {
    for (const post of posts) {
      finalPosts.push(post.data);
    }
  }

  return finalPosts.sort(
    (a, b) => new Date(b.created * 1000) - new Date(a.created * 1000)
  );
}

function prepareThemeSwitcher() {
  document
    .querySelector(".theme-switcher")
    .addEventListener("click", switchTheme, { passive: true });
}

prepareThemeSwitcher();
getPostsFromCache();
getPosts();
