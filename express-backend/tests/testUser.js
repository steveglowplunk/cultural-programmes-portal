const axios = require('axios');
const assert = require('assert');

const baseURL = 'http://localhost:3001/api';

async function testUserFunctions() {
    try {
        // Test GET /event/:id
        // try {
        //     let response = await axios.get(`${baseURL}/event/166329`);
        //     assert.strictEqual(response.status, 200);
        //     assert.strictEqual(response.data.success, true);
        //     console.log('Test passed: GET /event/:id');
        // } catch (error) {
        //     console.error('Test failed: GET /event/:id', error.response ? error.response.data : error.message);
        // }

        // // Test GET /event/venue/:venueId
        // try {
        //     let response = await axios.get(`${baseURL}/event/venue/3110031`);
        //     assert.strictEqual(response.status, 200);
        //     assert.strictEqual(response.data.success, true);
        //     console.log('Test passed: GET /event/venue/:venueId');
        // } catch (error) {
        //     console.error('Test failed: GET /event/venue/:venueId', error.response ? error.response.data : error.message);
        // }

        // // Test GET /event-categories
        // try {
        //     let response = await axios.get(`${baseURL}/event-categories`);
        //     assert.strictEqual(response.status, 200);
        //     assert.strictEqual(response.data.success, true);
        //     console.log('Test passed: GET /event-categories');
        // } catch (error) {
        //     console.error('Test failed: GET /event-categories', error.response ? error.response.data : error.message);
        // }

        // // Test GET /locations/distance
        // try {
        //     let response = await axios.get(`${baseURL}/locations/distance`);
        //     assert.strictEqual(response.status, 200);
        //     assert.strictEqual(response.data.success, true);
        //     console.log('Test passed: GET /locations/distance');
        // } catch (error) {
        //     console.error('Test failed: GET /locations/distance', error.response ? error.response.data : error.message);
        // }

        // // Test GET /locations/category
        // try {
        //     let response = await axios.get(`${baseURL}/locations/category`);
        //     assert.strictEqual(response.status, 200);
        //     assert.strictEqual(response.data.success, true);
        //     console.log('Test passed: GET /locations/category');
        // } catch (error) {
        //     console.error('Test failed: GET /locations/category', error.response ? error.response.data : error.message);
        // }

        //Test GET /locations/distance
        try {
            // Test GET /locations/distance
            try {
                const latitude = 22.3964; // Example latitude
                const longitude = 114.1095; // Example longitude
    
                let response = await axios.get(`${baseURL}/locations/distance`, {
                    params: {
                        latitude,
                        longitude
                    }
                });
                assert.strictEqual(response.status, 200);
                console.log('Test passed: GET /locations/distance');
                console.log('Locations:', response.data);
            } catch (error) {
                console.error('Test failed: GET /locations/distance', error.response ? error.response.data : error.message);
            }
    
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }

        // // Test GET /locations/more-than-3-events-asc
        // try {
        //     let response = await axios.get(`${baseURL}/locations/more-than-3-events-asc`);
        //     assert.strictEqual(response.status, 200);
        //     assert.strictEqual(response.data.success, true);
        //     console.log('Test passed: GET /locations/more-than-3-events-asc');
        // } catch (error) {
        //     console.error('Test failed: GET /locations/more-than-3-events-asc', error.response ? error.response.data : error.message);
        // }

        // // Test GET /locations/more-than-3-events-desc
        // try {
        //     let response = await axios.get(`${baseURL}/locations/more-than-3-events-desc`);
        //     assert.strictEqual(response.status, 200);
        //     assert.strictEqual(response.data.success, true);
        //     console.log('Test passed: GET /locations/more-than-3-events-desc');
        // } catch (error) {
        //     console.error('Test failed: GET /locations/more-than-3-events-desc', error.response ? error.response.data : error.message);
        // }

        // Test POST /users/:username/favourite-venues
        // try {
        //     let response = await axios.post(`${baseURL}/users/testuser/favourite-venues`, {
        //         venueId: '12345'
        //     });
        //     assert.strictEqual(response.status, 200);
        //     assert.strictEqual(response.data.success, true);
        //     console.log('Test passed: POST /users/:username/favourite-venues');
        // } catch (error) {
        //     console.error('Test failed: POST /users/:username/favourite-venues', error.response ? error.response.data : error.message);
        // }

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testUserFunctions();