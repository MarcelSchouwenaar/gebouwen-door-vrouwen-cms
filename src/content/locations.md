---
layout: page.html
eleventyImport: collections["location"]
---
<table>
   <thead>
      <tr>
         <th>Naam</th>
         <th>Architect</th>
         <th>Year</th>
         <th>Locatie</th>
      </tr>
   </thead>
   <tbody>
      {% for location in collections.location %}
         <tr class="listViewItem" 
            data-image="{{ location.data.images[0] }}" 
            data-title="{{ location.data.title }}">
            <td>{{ location.data.title }}</td>
            <td>{{ location.data.architect }}</td>
            <td>{{ location.data.year }}</td>
            <td>{{ location.data.address }}</td>
         </tr>
      {% endfor %}
   </tbody>

</table>

