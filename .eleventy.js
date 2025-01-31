const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

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

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);
  
  eleventyConfig.addFilter('stringify', (data) => {
    return JSON.stringify(data, null, "\t");
  })
  
  eleventyConfig.addFilter("jsonify", function (value) {
    return JSON.stringify(value);
  });

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /_site
  eleventyConfig.addPassthroughCopy({ "./src/admin": "admin"  });

  // Copy CSS Folder to /_site
  eleventyConfig.addPassthroughCopy({"./src/static/": "static"});

  // Copy CSS Folder to /_site
  eleventyConfig.addPassthroughCopy({"./src/_data/settings.json": "api/settings.json"});

  // Create JSON endpoints for collections


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
