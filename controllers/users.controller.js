const bcrypt = require("bcrypt");

const {
  isEmpty,
  getDateInMilliseconds,
  createNewApiKey,
  emailValidator,
} = require("../helpers");

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
        message: "please provide 'email','password', 'firstName','lastName'",
      });
    }
    // check if the email is valid
    const isValidEmail = emailValidator(email);
    if (!isValidEmail) {
      return res.status(400).json({
        message: "invalid email address",
      });
    }

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
    const { apikey } = await createNewApiKey(userId);

    res.status(200).json({
      message: "your registration was successful",
      apikey,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "an error occurred",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (isEmpty(email) || isEmpty(password)) {
      return res.status(400).json({
        message: " 'email' and 'password' are required",
      });
    }

    const [user, userEmailErrorMessage] = await getUserByEmail(email);
    if (userEmailErrorMessage) {
      return res.status(404).json({
        message: userEmailErrorMessage,
      });
    }
    // compare password to see if it matches the one in the database
    const previousPassword = user.password;
    const passwordMatch = await bcrypt.compare(
      String(password),
      previousPassword
    );
    if (!passwordMatch) {
      return res.status(400).json({
        message: "invalid credentials",
      });
    }

    const { apikey } = await createNewApiKey(user.id);
    res.status(200).json({
      message: "login successful",
      apikey,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "an error occurred",
    });
  }
};
module.exports = {
  createNewUser,
  getUserByEmail,
  loginUser,
};
