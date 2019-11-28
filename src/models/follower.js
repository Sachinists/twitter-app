const mongoose = require('mongoose')

const followersSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: false,
        ref: 'User'
    },
    otherPersonID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: false,
        ref: 'User'
    }
})

// followersSchema.methods.toJSON =  function () {
//     const follower = this

//     return follower.otherPersonID
// }

followersSchema.index({ owner: 1, otherPersonID: 1 }, { name: 'unique_index_name', unique: true });

const Followers = mongoose.model('Followers', followersSchema)

Followers.on('index', function(error) {
    if(error) throw new Error(error.message)
  });

module.exports = Followers