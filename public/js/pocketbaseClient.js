/*

import PocketBase from 'pocketbase';

// Initialize PocketBase client
const pb = new PocketBase('http://127.0.0.1:8090');

// Authenticate user (if needed)
async function authenticate() {
    const authData = await pb.admins.authWithPassword('chahaljas66@gmail.com', 'abc123123123');
    console.log(authData);
}

// fetch a paginated records list
const resultList = await pb.collection('Courses').getList(1, 50, {
    filter: 'created >= "2022-01-01 00:00:00" && someField1 != someField2',
});

// you can also fetch all records at once via getFullList
const records = await pb.collection('Courses').getFullList({
    sort: '-created',
});

const record = await pb.collection('Courses').getOne('RECORD_ID', {
    expand: 'relField1,relField2.subRelField',
});



// Call the functions
authenticate();
fetchData();
addRecord();

*/