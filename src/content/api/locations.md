---
permalink: '/api/locations.json'
eleventyImport: collections["location"]
eleventyExcludeFromCollections: true
templateEngineOverride: njk
---
{
  "locations": [
    {% for location in collections.location %}
      {
        "title": "{{ location.data.title}}",
        "url": "{{ location.url}}",
        "author": "{{ location.data.author}}",
        "date": "{{ location.data.date}}",
        "body": "{{ location.data.body}}",
        "agency": "{{ location.data.agency}}",
        "architect": "{{ location.data.architect}}",
        "year": "{{ location.data.year}}",
        "images": "{{ location.data.images}}",
        "tags": "{{ location.data.tags}}",
        "location": {{ location.data.location | jsonify | safe }}
      }{% if forloop.last == false %},{% endif %}
    {% endfor %}
  ]
}