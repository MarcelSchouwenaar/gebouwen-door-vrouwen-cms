---
layout: default.html
eleventyImport: collections["location"]
---
# Locations 

{% for location in collections.location %}

   [{{ location.data.title }}]({{ location.url }})

{% endfor %}

