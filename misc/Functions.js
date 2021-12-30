import axiosInstance from "./Axios";


var regions = [];
var cities = [];
var delivery_methods= [];
var pickup_locations = [];
export async function getRegions(country_id) {
    await axiosInstance.get(`/v1/regions/?country_id=${country_id}`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
        }
        else {
            
            regions = response.data.data.map((row, i) => {
                return { value: row.id, label: `${row.name}`,  uuid: row.uuid}
            });
            console.log("THIS IS RESPONSE FOR COUNTRIES ", countries)
        }
    }).catch(error => {

    })
    return regions;
}

export async function getCities(region_id) {
    await axiosInstance.get(`/v1/cities/?region_id=${region_id}`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
            cities = [];
        }
        else {
            
            cities = response.data.data.map((row, i) => {
                return { value: row.id, label: `${row.name}`, uuid: row.uuid}
            });
            console.log("THIS IS RESPONSE FOR COUNTRIES ", countries)
        }
    }).catch(error => {

    })
    return cities;
}

export async function getPickupLocations(city_id) {
    await axiosInstance.get(`/v1/pickup_locations/?city_id=${city_id}`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
            pickup_locations = [];
        }
        else {
            
            pickup_locations = response.data.data.map((row, i) => {
                return { value: row.id, label: `${row.name}`, uuid: row.uuid}
            });
            console.log("THIS IS RESPONSE FOR COUNTRIES ", pickup_locations)
        }
    }).catch(error => {

    })
    return pickup_locations;
}

export async function getDeliveryMethods(region_id) {
    await axiosInstance.get(`/v1/delivery_methods`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
            delivery_methods = [];
        }
        else {
            
            delivery_methods = response.data.data.map((row, i) => {
                return { value: row.id, label: `${row.name}`, phone_code: row.phone_code, code: row.code, default_delivery_fee: row.default_delivery_fee, default_duration: row.default_duration}
            });
            console.log("THIS IS RESPONSE FOR COUNTRIES ", delivery_methods)
        }
    }).catch(error => {

    })
    return delivery_methods;
}

  
  
 