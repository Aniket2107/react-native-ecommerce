const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET_KEY;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/product(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/category(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/order(.*)/, methods: ["GET", "OPTIONS"] },
      "/api/user/login",
      "/api/user/register",
    ],
  });
}

module.exports = authJwt;
