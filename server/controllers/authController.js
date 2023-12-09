const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UsersModel");

// path:  auth/register
// Create new User then return access token

const register = async (req, res) => {
  const {username, roles, email, password, profileImage} = req.body;
  try {
    const user = await UserModel.findOne({email});
    // If Duplicate
    if (user) {
      return res.status(409).json({message: "This Email Is Already in use."});
    }

    if (!username || !password || !email) {
      return res.status(400).json({message: "All info is Required!"});
    }

    const hashedPassword = await bcrypt.hash(password, 15);

    const newUser = new UserModel({
      password: hashedPassword,
      username,
      roles,
      email,
      profileImage,
    });

    await newUser.save();

    const accessToken = jwt.sign(
      {
        userInfo: {
          username: newUser.username,
          email: newUser.email,
          roles: newUser.roles,
          profileImage: newUser.profileImage,
          favoritesMovies: newUser.favoritesMovies,
          id: newUser._id,
        },
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );

    const refreshToken = jwt.sign(
      {
        userInfo: {
          username: newUser.username,
          email: newUser.email,
          roles: newUser.roles,
          profileImage: newUser.profileImage,
          favoritesMovies: newUser.favoritesMovies,
          id: newUser._id,
        },
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });
    return res
      .status(201)
      .json({message: "You Registered Successfully.", accessToken});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: error?.message || error?.error});
  }
};

// path : auth
// Explain : When User Logged in I'll Create (Acc,Ref) Token The Acc For The Current Session , And The Refresh Token meaning is (how many time user can have authorization with out Re Login)
const login = async (req, res) => {
  const {email, password} = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({message: "Not Enough Data."});
    }

    const user = await UserModel.findOne({email});

    if (user === null || user === undefined || !user) {
      return res
        .status(400)
        .json({message: "There's no user exist with this email."});
    }

    const unHashedPwd = await bcrypt.compare(password, user.password);

    if (!unHashedPwd) {
      return res
        .status(400)
        .json({message: "The Email Or Password Is Incorrect."});
    }

    const accessToken = jwt.sign(
      {
        userInfo: {
          username: user.username,
          email: user.email,
          roles: user.roles,
          profileImage: user.profileImage,
          favoritesMovies: user.favoritesMovies,
          id: user._id,
        },
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );

    const refreshToken = jwt.sign(
      {
        userInfo: {
          username: user.username,
          email: user.email,
          roles: user.roles,
          profileImage: user.profileImage,
          favoritesMovies: user.favoritesMovies,
          id: user._id,
        },
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User logged in successfully.",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({message: error?.message || error?.error});
  }
};

// path : auth
// Explain : I'll use this when I (1) :Refresh The Page which mean the user has lost the accessToken, So I'll Re Create new One

const refreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({message: "Login Please."});
  }

  const token = cookies?.jwt;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({message: "Forbidden"});

    const accessToken = jwt.sign(
      {
        userInfo: {
          username: decoded.userInfo.username,
          email: decoded.userInfo.email,
          roles: decoded.userInfo.roles,
          profileImage: decoded.userInfo.profileImage,
          favoritesMovies: decoded.userInfo.favoritesMovies,
          id: decoded.userInfo.id,
        },
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );
    return res.status(200).json({accessToken});
  });
};

// path : /auth/logout
const logout = async (req, res) => {
  try {
    const jwtCookie = req.cookies?.jwt;

    if (!jwtCookie) {
      return res
        .status(200)
        .json({message: "The RefreshToken has Already Deleted But It's Okay."});
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({message: "Cookies Cleared Successfully."});
  } catch (error) {
    return res.status(500).json({message: error?.message || error?.error});
  }
};

module.exports = {
  login,
  refreshToken,
  logout,
  register,
};
