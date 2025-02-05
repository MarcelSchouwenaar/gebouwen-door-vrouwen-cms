---
permalink: '/api/locations.json'
eleventyExcludeFromCollections: true
eleventyImport: collections["allLocations"]
templateEngineOverride: njk
layout: false
---
{{ collections.allLocations | serializeLocations | safe }}