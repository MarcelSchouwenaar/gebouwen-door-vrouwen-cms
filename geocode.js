const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml"); // Install via `npm install js-yaml`

const CONTENT_DIR = "./src/content/location"; // Adjust this to your actual content folder

async function fetchAddress(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch address");
    const data = await response.json();
    return data.display_name || "Address not found";
  } catch (error) {
    console.error("Geocoding error:", error);
    return "Lookup failed";
  }
}

async function fetchCoordinates(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch coordinates");
    const data = await response.json();
    if (data.length === 0) return null;
    return { type: "Point", coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)] };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

async function processFiles() {
  const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith(".md"));

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    let content = fs.readFileSync(filePath, "utf-8");

    // Extract front matter
    const match = content.match(/---\n([\s\S]+?)\n---/);
    if (!match) continue;

    let frontMatter = yaml.load(match[1]); // Properly parse YAML

    try {
      if (!frontMatter.address && frontMatter.location) {
        console.log(`Fetching address for ${file}...`);
        const locationObj = JSON.parse(frontMatter.location);
        if (locationObj.coordinates) {
          const [longitude, latitude] = locationObj.coordinates;
          frontMatter.address = await fetchAddress(latitude, longitude);
        }
      }
      
      if (!frontMatter.location && frontMatter.address) {
        console.log(`Fetching coordinates for address in ${file}...`);
        const locationObj = await fetchCoordinates(frontMatter.address);
        if (locationObj) {
          frontMatter.location = JSON.stringify(locationObj);
        }
      }

      // Convert back to YAML
      const newYaml = yaml.dump(frontMatter);
      const newContent = `---\n${newYaml}---\n${content.replace(match[0], "").trim()}`;

      // Write the updated content back
      fs.writeFileSync(filePath, newContent, "utf-8");
      console.log(`Updated ${file} with address and/or location.`);
    } catch (error) {
      console.error(`Failed to process ${file}:`, error);
    }
  }
}


module.exports = { processFiles };
