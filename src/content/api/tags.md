---
permalink: '/api/tags.json'
eleventyImport: collections["allTags"]
eleventyExcludeFromCollections: true
templateEngineOverride: njk
---
{{ collections.allTags | serializeTags | safe}}
