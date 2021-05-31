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

async function getPosts() {
  try {
    const listings = await Promise.all(
      SUBREDDITS.map(async (sub) => {
        const response = await fetch(
          `https://www.reddit.com/r/${sub}/new.json?limit=${LIMIT}`
        );
        return await response.json();
      })
    );

    appendListingsToDOM(listings);
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
    const redditUrl = `https://reddit.com${data.permalink}`;

    const link = document.createElement("a");
    link.classList.add("link");
    link.textContent = decodeHTML(data.title);
    link.href = data.domain.startsWith("self.") ? redditUrl : data.url;
    link.target = "_blank";
    link.rel = "noopener";

    const date = document.createElement("span");
    date.textContent = new Date(data.created * 1000).toLocaleDateString();

    const subreddit = document.createElement("a");
    subreddit.classList.add("subreddit");
    subreddit.textContent = data.subreddit;
    subreddit.target = "_blank";
    subreddit.rel = "noopener";
    subreddit.href = redditUrl;

    const icon = document.createElement("img");
    icon.alt = `${data.domain}`;
    icon.loading = "lazy";
    const domainURL = data.domain.startsWith("self.")
      ? "reddit.com"
      : data.domain;
    icon.src = `https://www.google.com/s2/favicons?domain_url=${domainURL}&sz=16`;
    icon.classList.add("site-icon");

    const li = document.createElement("li");
    const title = document.createElement("span");
    title.classList.add("title");
    title.append(icon, link);

    li.classList.add("post");
    li.append(title, subreddit, " • ", date);

    fragment.append(li);
  }

  postsElement.append(fragment);
}

function getSortedPostsFromListings(listings) {
  const initialPosts = [];
  const allPosts = listings.map((listing) => listing.data.children);
  for (const posts of allPosts) {
    for (const post of posts) {
      initialPosts.push(post.data);
    }
  }

  const sortedPosts = initialPosts.sort(
    (a, b) => new Date(b.created * 1000) - new Date(a.created * 1000)
  );
  const uniquePosts = getUnique(sortedPosts, "title");
  return uniquePosts;
}

function getUnique(array, property) {
  const uniqueArray = [];

  for (const item of array) {
    if (!uniqueArray.some((element) => element[property] === item[property])) {
      uniqueArray.push(item);
    }
  }

  return uniqueArray;
}

function prepareThemeSwitcher() {
  document
    .querySelector(".theme-switcher")
    .addEventListener("click", switchTheme, { passive: true });
}

function createSkeletonNodes() {
  const skeletonsNumber = LIMIT * SUBREDDITS.length;
  const posts = document.querySelector(".posts");

  for (let index = 0; index < skeletonsNumber; index++) {
    const skeleton = document.createElement("li");
    skeleton.classList.add("post");

    const title = document.createElement("div");
    title.classList.add("line-skeleton", "title-skeleton");
    const subtitle = document.createElement("div");
    subtitle.classList.add("line-skeleton", "subtitle-skeleton");

    skeleton.append(title, subtitle);

    posts.append(skeleton);
  }
}

function decodeHTML(text) {
  let textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

getPosts();
createSkeletonNodes();
prepareThemeSwitcher();
