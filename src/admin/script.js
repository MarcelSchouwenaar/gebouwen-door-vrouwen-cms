DecapCmsApp.init();
        
console.log("Starting Decap CMS");

DecapCmsApp.registerPreviewStyle("admin.css");
DecapCmsApp.registerEventListener({
name: 'preSave',
handler: async ({ entry }) => {

    let data = entry.get('data');

    let hasNoLocation = (!data.get('location') || data.get('location') === '');
    let hasNoAddress = (!data.get('address') || data.get('address') === '');

    console.log("PreSave event", "has no address: ", hasNoAddress, "has no location:", hasNoLocation);

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

},
});

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



