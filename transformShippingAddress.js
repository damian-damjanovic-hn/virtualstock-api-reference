// Parse the response body
let responseBody = pm.response.json();

// Function to transform the shipping address
function transformShippingAddress(shipping_address) {
    let new_shipping_address = {
        "country": null,
        "line_1": null,
        "line_2": null,
        "city": null,
        "state": null,
        "postal_code": shipping_address["postal_code"],
        "phone": shipping_address["phone"],
        "full_name": shipping_address["full_name"],
        "email": shipping_address["email"]
    };

    // Transform country field
    if (shipping_address["country"] === "Australia") {
        new_shipping_address["country"] = "AU";
    } else {
        new_shipping_address["country"] = shipping_address["country"];
    }

    // Retain line_1, line_2, and postal_code
    new_shipping_address["line_1"] = shipping_address["line_1"];
    new_shipping_address["line_2"] = shipping_address["line_2"];

    // Handle city and state transformation
    if (!shipping_address["state"] && shipping_address["city"]) {
        // If state is missing, assume city is stored in state, and city is in line_2
        new_shipping_address["state"] = shipping_address["city"];
        if (shipping_address["line_2"]) {
            new_shipping_address["city"] = shipping_address["line_2"];
            new_shipping_address["line_2"] = null;  // Clear line_2 as it's now used for city
        }
    } else {
        new_shipping_address["city"] = shipping_address["city"];
        new_shipping_address["state"] = shipping_address["state"];
    }

    return new_shipping_address;
}

// Check if the response contains a results array
if (responseBody.results && Array.isArray(responseBody.results)) {
    // Loop through each order in the results array and transform the shipping address
    responseBody.results.forEach(order => {
        if (order.hasOwnProperty('shipping_address')) {
            order['shipping_address'] = transformShippingAddress(order['shipping_address']);
        }
    });

    // Set the transformed response as an environment variable (optional)
    pm.environment.set("transformed_response", JSON.stringify(responseBody));

    // Log the transformed response (optional)
    console.log(responseBody);

    // Set the transformed response body (useful if you want to view it in Postman)
    pm.response.json = function () { return responseBody; };

    // Validate the transformation
    pm.test("Transformed shipping addresses", function () {
        responseBody.results.forEach(order => {
            pm.expect(order).to.have.property('shipping_address');
            pm.expect(order.shipping_address).to.have.property('country');
            pm.expect(order.shipping_address).to.have.property('line_1');
            pm.expect(order.shipping_address).to.have.property('city');
            pm.expect(order.shipping_address).to.have.property('state');
        });
    });

} else {
    // Handle cases where the results array is not present
    console.log("No results array found in the response.");
}
