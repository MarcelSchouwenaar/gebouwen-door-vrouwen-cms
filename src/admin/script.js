if (typeof Node === "function" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function(child) {
    /*
    console.log("removeChild...");
    console.log("this", this);
    console.log("this.outerHTML", this.outerHTML);
    console.log("child", child);
    console.log(
      "this.childNodes",
      this.childNodes.length,
      Array.prototype.slice
        .call(this.childNodes)
        .map(child => console.warn("child.nodeValue", child.nodeValue))
    );
    console.log("child.parentNode", child.parentNode.outerHTML);
    */
    // debugger;    
    if (child.parentNode !== this) {
      if (console) {
        console.error(
          "Cannot remove a child from a different parent",
          child,
          this
        );
      }
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  };
}
// Global flag to prevent double initialization
if (window.DECAP_CMS_INITIALIZED) {
    console.log("⚠️ Decap CMS already initialized, script exiting...");
    return;
}

setTimeout(() => {
    
    let DecapCmsApp = window.DecapCms;
    
    console.log("📋 Decap CMS initialization check:");
    console.log("- DecapCms available:", !!DecapCmsApp);
    console.log("- Manual init flag:", !!window.CMS_MANUAL_INIT);
    console.log("- Already initialized flag:", !!window.DECAP_CMS_INITIALIZED);
    
    // Check if CMS UI is already in the DOM
    const existingCMS = document.querySelector('[data-slate-fragment]') || 
                       document.querySelector('.nc-entryEditor-editor') ||
                       document.querySelector('[class*="cms"]') ||
                       document.querySelector('[class*="Pane"]');
    
    if (existingCMS) {
        console.log("⚠️ Decap CMS UI already exists in DOM, skipping initialization");
        console.log("Existing element:", existingCMS);
        return;
    }

    console.log("🚀 Initializing Decap CMS...");
    window.DECAP_CMS_INITIALIZED = true;
    
    DecapCmsApp.init();
            
    console.log("✅ Decap CMS started");
    console.log("📝 Registering preSave event listener...");

    DecapCmsApp.registerPreviewStyle("admin.css");
    DecapCmsApp.registerEventListener({
        name: 'preSave',
        handler: async ({ entry }) => {
            console.log("🔥 PRESAVE EVENT TRIGGERED!");
            console.log("Entry object:", entry);
            console.log("Entry data available:", !!entry.get);

            let data = entry.get('data');
            console.log("Raw data object:", data);

            let hasNoLocation = (!data.get('location') || data.get('location') === '');
            let hasNoAddress = (!data.get('address') || data.get('address') === '');

            console.log("📍 PreSave event analysis:");
            console.log("- Address value:", data.get('address'));
            console.log("- Location value:", data.get('location'));
            console.log("- Has no address:", hasNoAddress);
            console.log("- Has no location:", hasNoLocation);

            if (hasNoLocation == true && hasNoAddress == true) return data;

            let [address, location] = [data.get('address'), data.get('location')];

            if (hasNoLocation == true && hasNoAddress == false) {
                // fetch location from address
                console.log("retreiving location from address", address);
                location = await fetchCoordinates(address);
                if(!!location.coordinates){
                    location = JSON.stringify(location);
                } else {
                    location = null;
                }
                console.log("location fetched", location);
            }  
            
            if (hasNoAddress == true && hasNoLocation == false) {
                // fetch address from location
                const locationObj = JSON.parse(location);

                console.log("retreiving address from location", locationObj);

                if (locationObj.coordinates) {
                    const [longitude, latitude] = locationObj.coordinates;
                    console.log("fetching address from coordinates", latitude, longitude);  
                    address = await fetchAddress(latitude, longitude);
                    console.log("address fetched", address);
                }
                
            }
            data = data.set("address", address);
            data = data.set("location", location);

            return data;

        }
    });
    
    console.log("✅ PreSave event listener registered successfully!");

},200);


async function fetchAddress(latitude, longitude) {
    console.log(">> fetching address from coordinates", latitude, longitude);
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch address");
        const data = await response.json();
        console.log(">> Address data", data);
        return data.display_name || "Address not found";
    } catch (error) {
        console.error("Geocoding error:", error);
        return "Lookup failed";
    }
}

async function fetchCoordinates(address) {
    console.log(">> fetching coordinates from address", address);
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



