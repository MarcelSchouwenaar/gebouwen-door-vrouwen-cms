const Fetch = require("@11ty/eleventy-fetch");
const fs = require("fs");

module.exports = async function () {
	//first we fetch the data from Google Maps
	//then we fetch the data from Google Forms

	let url = "https://api.github.com/repos/11ty/eleventy";

	let json = await Fetch(url, {
		duration: "1d", // save for 1 day
		type: "json", // we’ll parse JSON for you
	});

	return json;
};