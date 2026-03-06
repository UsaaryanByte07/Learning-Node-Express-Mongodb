const express = require("express");
const {
  getAddHome,
  postAddHome,
  getEditHome,
  getHostHomes,
  postEditHome,
  postDeleteHome,
} = require("../controllers/hostController");

const hostRouter = express.Router();

hostRouter.get("/host-homes", getHostHomes);

hostRouter.get("/add-home", getAddHome);

hostRouter.post("/edit-home",postEditHome);

hostRouter.post("/add-home", postAddHome);

hostRouter.post('/delete-home/:homeId',postDeleteHome);

hostRouter.get("/edit-home/:homeId", getEditHome);

module.exports = {
  hostRouter,
};
