---
permalink: '/api/tags.json'
eleventyImport: collections["location_tag"]
eleventyExcludeFromCollections: true
templateEngineOverride: njk
---
{
  "tags": [
    {% for tag in collections.location_tag %}
      {
        "title": "{{ tag.data.title}}",
        "marker": "{{ tag.data.marker}}"
      }
    {% if forloop.last != false %},{% endif %}
    {% endfor %}
  ]
}
