const bcrypt = require("bcrypt");

const {
  isEmpty,
  generateApiKey,
  getDateDiff,
  getDateInMilliseconds,
} = require("../helpers");
const ApiKeys = require("../models/apikeys.model");
const Users = require("../models/users.model");

const getUserByEmail = async (email) => {
  try {
    const user = await Users.findOne({ email }, [
      "email",
      "password",
      "id",
      "firstName",
    ]);
    if (!user) {
      return [null, "User not found"];
    }
    return [user, null];
  } catch (error) {
    return [null, error];
  }
};

const createNewUser = async (req, res) => {
  try {
    let { email, password, firstName, lastName } = req.body;

    if (
      isEmpty(email) ||
      isEmpty(password) ||
      isEmpty(firstName) ||
      isEmpty(lastName)
    ) {
      return res.status(400).json({
        message: "please provide `email`,`password`, `firstName`,`lastName`",
      });
    }
    // check if the password is strong

    // check if user with email already exist
    const [user] = await getUserByEmail(email);
    if (user) {
      return res.status(400).json({
        message: "user already exist",
      });
    }
    // hash the password before storing in the database
    const hashedPassword = await bcrypt.hash(String(password), 10);
    password = hashedPassword;
    const joinedAt = getDateInMilliseconds();
    const newUser = {
      email,
      password,
      firstName,
      lastName,
      joinedAt,
    };
    // get the id of the new user
    const { inserted_hashes } = await Users.create(newUser);
    const userId = inserted_hashes[0];

    // generate api key
    const key = generateApiKey();
    // set expiry date for key
    const expiresIn = getDateDiff();

    await ApiKeys.create({
      userId,
      key,
      expired: false,
      expiresIn,
    });
    res.status(200).json({
      message: "your registration was successful",
      apikey: key,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "an error has occurred",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (isEmpty(email) || isEmpty(password)) {
    return res.status(400).json({
      message: " 'email' and 'password' are required",
    });
  }

  const [user, userErrorMessage] = await getUserByEmail(email);
  if (userErrorMessage) {
    return res.status(400).json({
      message: userErrorMessage,
    });
  }
  // compare password to see if it matches the one in the database
  const previousPassword = user.password;
  const passwordMatch = await bcrypt.compare(
    String(password),
    previousPassword
  );
  if (!passwordMatch) {
    return res.status(400).json({});
  }
};
module.exports = {
  createNewUser,
  getUserByEmail,
};
