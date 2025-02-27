const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { processFiles } = require("./geocode.js");
const sharp = require('sharp');



module.exports = function (eleventyConfig) {

  console.log(">> eleventy build started <<");


  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addWatchTarget("./src/static/");

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  eleventyConfig.addCollection("allLocations", (collectionApi) => {
		return collectionApi.getFilteredByGlob("src/content/location/*.md");
	});
  eleventyConfig.addCollection("allTags", (collectionApi) => {
		return collectionApi.getFilteredByGlob("src/content/location_tag/*.md");
	});


  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);
  
  eleventyConfig.addFilter("jsonify", (value) => {
    return JSON.stringify(value);
  });

  eleventyConfig.addFilter("serializeLocations", (locations) => {
    
    const allLocationsArr = locations.map((location) => {
      return {
        title: location.data.title,
        url: location.url,
        agency: location.data.agency,
        author: location.data.author,
        architect: location.data.architect,
        images: location.data.images,
        location_tags: location.data.location_tags,
        coordinates: JSON.parse(location.data.location),
      };
    })
    const allLocationsObj = {locations: allLocationsArr};
    return JSON.stringify(allLocationsObj, null, 2);
  })
  eleventyConfig.addFilter("serializeTags", (tags) => {   
    const allTagsArr = tags.map((tag) => {
      return {
        title: tag.data.title,
        title_en: tag.data.title_en,
        marker: tag.data.marker,
        marker_img: tag.data.marker_img,
      };
    })
    const allTagsObj = {tags: allTagsArr};
    return JSON.stringify(allTagsObj, null, 2);
  })

  eleventyConfig.addFilter("btoa", function (value) {
    return btoa(value);
  });

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /_site
  eleventyConfig.addPassthroughCopy({ "./src/admin": "admin"  });

  // Copy CSS Folder to /_site
  eleventyConfig.addPassthroughCopy({"./src/static/css": "static/css"});
  eleventyConfig.addPassthroughCopy({"./src/static/img": "static/img"});
  eleventyConfig.addPassthroughCopy({"./src/static/fonts": "static/fonts"});
  eleventyConfig.addPassthroughCopy({"./src/static/js": "static/js"});
  eleventyConfig.addPassthroughCopy({"./src/static/app.js": "static/app.js"});
  eleventyConfig.addPassthroughCopy({"./src/static/settings.js": "static/settings.js"});

  // eleventyConfig.on('eleventy.before', async () => {
  //   const dimensions = [512, 256, 192, 180, 32, 16];

  //   await Promise.all(dimensions.map(async (dimension) => {
  //     try {
  //       await sharp('src/static/icons/Icon.svg')
  //         .png()
  //         .resize(dimension, dimension)
  //         .toFile(`_site/static/icons/icon-${dimension}x${dimension}.png`);
  //     } catch (err) {
  //       console.log('[11ty] ERROR Generating favicon');
  //       console.log(err);
  //     }
  //   }));
   
  // })

  // Copy CSS Folder to /_site
  eleventyConfig.addPassthroughCopy({"./src/_data/settings.json": "api/settings.json"});
  eleventyConfig.addPassthroughCopy({"./src/_data/navigation.json": "api/navigation.json"});

  return {
    dir: {
      input: "./src/content",
      data: "../_data",
      output: "./_site",
      layouts: "../_includes"
    },
    htmlTemplateEngine: "njk",


  };
};
