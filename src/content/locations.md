---
layout: partials/content.html
eleventyImport: collections["location"]
---

{% for location in collections.location %}
   <article markdown="1">
   [{{ location.data.title }}]({{ location.url }})
   </article>
{% endfor %}

