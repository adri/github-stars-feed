const Feed = require("feed");
const fetch = require("node-fetch");
const url = require("url");

const starsToFeed = (stars) => {
  let feed = new Feed({
    title: "Github Stars",
    description: "These is a feed of Github Stars!",
    id: "http://github.com/",
    link: "http://github.com/",
    image:
      "https://assets-cdn.github.com/images/modules/logos_page/GitHub-Logo.png",
    favicon: "https://github.com/favicon.ico",
    copyright: "",
    generator: "github-stars-feed", // optional, default = 'Feed for Node.js'
  });

  // Format example https://api.github.com/users/adri/starred
  stars.forEach((star) => {
    feed.addItem({
      title: star.full_name,
      id: star.id,
      link: star.html_url,
      description: star.description,
      content: `⭐ ${star.stargazers_count} 🍴 ${star.forks}`,
      date: new Date(star.updated_at),
      image: star.owner.avatar_url,
    });
  });

  return feed;
};

module.exports = async (req, res) => {
  const query = url.parse(req.url, true).query;
  const response = await fetch(
    `https://api.github.com/users/${query.user}/starred`
  );
  const stars = await response.json();

  res.setHeader("Content-Type", "application/atom+xml");
  res.send(starsToFeed(stars).atom1());
};
