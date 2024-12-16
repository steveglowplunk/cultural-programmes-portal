const axios = require('axios');

const baseURL = 'http://localhost:3001/admin';

async function testAdminFunctions() {
    try {
        //Create a new user
        // Delete the user if it already exists
        try {
            let response = await axios.get(`${baseURL}/users`);
            const existingUser = response.data.find(user => user.username === 'testuser');
            if (existingUser) {
                await axios.delete(`${baseURL}/users/${existingUser._id}`);
                console.log('Deleted existing test user');
            }
        } catch (error) {
            console.error('Error deleting existing user:', error.response ? error.response.data : error.message);
        }
        let response = await axios.post(`${baseURL}/users`, {
            username: 'testuser',
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123'
        });
        console.log('Create User:', response.data);
        const userId = response.data._id;

        // // Get all users
        // response = await axios.get(`${baseURL}/users`);
        // console.log('Get All Users:', response.data);

        // Get user by ID
        // response = await axios.get(`${baseURL}/users/${userId}`);
        // console.log('Get User By ID:', response.data);

        // // Update user by ID
        // response = await axios.put(`${baseURL}/users/${userId}`, {
        //     username: 'Updated User'
        // });
        // console.log('Update User By ID:', response.data);

        // // Delete user by ID
        response = await axios.delete(`${baseURL}/users/${userId}`);
        console.log('Delete User By ID:', response.status);

        // // Create a new event
        // response = await axios.post(`${baseURL}/events`, {
        //     title: 'Test Event',
        //     description: 'This is a test event',
        //     date: '2023-01-01',
        //     venueId: '12345'
        // });
        // console.log('Create Event:', response.data);
        // const eventId = response.data._id;

        // // Get all events
        // response = await axios.get(`${baseURL}/events`);
        // console.log('Get All Events:', response.data);

        // // Get event by ID
        // response = await axios.get(`${baseURL}/events/${eventId}`);
        // console.log('Get Event By ID:', response.data);

        // // Update event by ID
        // response = await axios.put(`${baseURL}/events/${eventId}`, {
        //     title: 'Updated Event'
        // });
        // console.log('Update Event By ID:', response.data);

        // // Delete event by ID
        // response = await axios.delete(`${baseURL}/events/${eventId}`);
        // console.log('Delete Event By ID:', response.status);

        // // Create a new location
        // response = await axios.post(`${baseURL}/locations`, {
        //     venueId: '12345',
        //     venueNameC: 'Test Location C',
        //     venueNameE: 'Test Location E',
        //     latitude: '22.3964',
        //     longitude: '114.1095'
        // });
        // console.log('Create Location:', response.data);
        // const locationId = response.data._id;

        // // Get all locations
        // response = await axios.get(`${baseURL}/locations`);
        // console.log('Get All Locations:', response.data);

        // // Get location by ID
        // response = await axios.get(`${baseURL}/locations/${locationId}`);
        // console.log('Get Location By ID:', response.data);

        // // Update location by ID
        // response = await axios.put(`${baseURL}/locations/${locationId}`, {
        //     venueNameC: 'Updated Location C'
        // });
        // console.log('Update Location By ID:', response.data);

        // // Delete location by ID
        // response = await axios.delete(`${baseURL}/locations/${locationId}`);
        // console.log('Delete Location By ID:', response.status);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testAdminFunctions();