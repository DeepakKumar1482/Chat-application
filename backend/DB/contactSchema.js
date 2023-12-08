const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
    UserID: {
        type: String,
    },
    name: {
        type: String,
    },
    contacts: [{
        nanoid: {
            type: String,
        },
        contactuser: {
            type: String,
        },
        chats: {
            type: Array
        }
        // You can add other properties as needed
    }],
});

const contactModel = mongoose.model('contacts', contactSchema);
module.exports = contactModel;