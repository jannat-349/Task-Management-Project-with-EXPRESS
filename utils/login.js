const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function getUserTokens(user, res) {
  const accesssToken = jwt.sign(
    { email: user.email, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "2m" }
  );
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3m",
  });
  const userObj = user.toJSON();
  userObj["accessToken"] = accesssToken;
  userObj["refreshToken"] = refreshToken;
  res.status(200).json(userObj);
}
async function handleEmailLogin(email, res, password) {
  const user = await User.findOne({ email: email });
  if (user) {
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      await getUserTokens(user, res);
    } else {
      res.status(401).json({ message: `Wrong Password!!` });
    }
  } else {
    res.status(404).json({ message: `User Not Found` });
  }
}

async function handleRefreshLogin(refreshToken, res) {
  if (!refreshToken) {
    res.status(404).json({ message: `No refresh token defined` });
  } else {
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        res.status(401).json({ message: `Unauthorized` });
      } else {
        const id = payload.id;
        const user = await User.findById(id);
        if (user) {
          await getUserTokens(user, res);
        } else {
          res.status(404).json({ message: `User Not Found` });
        }
      }
    });
  }
}

module.exports = { handleEmailLogin, handleRefreshLogin };
