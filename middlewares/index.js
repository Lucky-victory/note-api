/**
 * 
  get token from authorization header or from request 'api_key' query params
 */
const getTokenFromHeaderOrQuery = (req, res) => {
  const authInHeader = req.headers && req.headers["authorization"];
  const authInQuery = req.query.api_key;
  let token;
  if (authInHeader) {
    // split the authorization property and get the second part, e.g Bearer ggu5-fjdi..
    token = authInHeader.split(" ")[1];

    // append the token to request object, so it can be access by other middlewares
    req.token = token;
    return;
  } else if (authInQuery) {
    token = authInQuery;
    // append the token to request object, so it can be access by other middlewares
    req.token = token;
    return;
  }
  return res.status(403).json({ message: "No token provided " });
};

module.exports = {
  getTokenFromHeaderOrQuery,
};
