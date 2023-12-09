const mongoose = require("mongoose");

const usersSchema = mongoose.Schema(
  {
    username: {type: String, required: true, lowercase: true},
    password: {type: String, required: true},
    profileImage: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    },
    email: {type: String, required: true, unique: true, lowercase: true},
    favoritesMovies: [{type: mongoose.Schema.Types.ObjectId, ref: "movies"}],
    roles: {type: [String], default: ["user"]},
  },

  {timestamps: true}
);

const UserModel = mongoose.model("User", usersSchema);

module.exports = UserModel;
