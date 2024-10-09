import express from "express";
import passport from "passport";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import config from "../../../config.js";

const router = express.Router();

router.get(
  "/discord",
  passport.authenticate("discord", { scope: ["identify"] })
);

router.get(
  "/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(config.server.frontEnd);
  }
);

router.get("/@me", isAuthenticated, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export default router;
