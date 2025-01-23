---
layout: default.html
eleventyImport: collections["location"]
---
# Locations 

{% for location in collections.location %}
<article>
    <a href="{{ location.url }}">{{ location.data.title }}</a>
</article>
{% endfor %}

