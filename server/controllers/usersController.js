const UserModel = require("../models/UsersModel.js");
const bcrypt = require("bcrypt");

// path : user
// method : POST
// Create New User

// path : user
// method : GET
// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});

    if (!users) {
      return res.status(204).json({message: "There's No Users Available."});
    }
    return res.status(200).json({message: "Users Found Successfully.", users});
  } catch (error) {
    return res.status(500).json({message: error?.message || error?.error});
  }
};

// path : user
// method : PATCH
// EDIT USER INFO
const patchUser = async (req, res) => {
  const {id, password, email, username, profileImage} = req.body;

  try {
    if (!id || !email || !username || !profileImage) {
      return res.status(400).json({message: "Provide All Info Please."});
    }
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(400).json({message: "No user Available"});
    }

    const duplicate = await UserModel.findOne({email});

    if (duplicate && duplicate._id.toString() !== id) {
      return res.status(409).json({message: "This Email Is already in use."});
    }

    user.username = username;
    user.email = email;
    user.profileImage = profileImage;

    if (password) {
      const newHashedPassword = await bcrypt.hash(password, 15);
      user.password = newHashedPassword;
    }

    await user.save();

    return res.status(200).json({message: "User Updated Successfully.", user});
  } catch (error) {
    return res.status(500).json({message: error?.message || error?.error});
  }
};

// path : user
// method : DELETE
// DELETE USER
const deleteUser = async (req, res) => {
  const {userId} = req.params;

  try {
    if (!userId) {
      return res.status(400).json({message: "Provide Id Please."});
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({message: "No user Available."});
    }

    await user.deleteOne();

    return res.status(200).json({message: "User Deleted Successfully."});
  } catch (error) {
    return res.status(500).json({message: error?.message || error?.error});
  }
};

module.exports = {
  getUsers,
  patchUser,
  deleteUser,
};
