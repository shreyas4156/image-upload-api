const Joi = require("joi");
const express = require("express");
const router = express.Router();
const users = [
  { id: 1, name: "user1" },
  { id: 2, name: "user2" },
  { id: 3, name: "user3" },
];

router.get("/", (req, res) => {
  res.send(users);
});

router.post("/", (req, res) => {
  const { error } = inputValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const course = {
    id: users.length + 1,
    name: req.body.name,
  };
  users.push(course);
  res.send(course);
});

router.put("/:id", (req, res) => {
  const course = users.find((value) => value.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("provide a valid id");

  const { error } = inputValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

router.delete("/:id", (req, res) => {
  const course = users.find((value) => value.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("provide a valid id");

  const index = users.indexOf(course);
  const deleted = users.splice(index, 1);
  res.send(deleted);
});

function inputValidate(u) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(u, schema);
}
module.exports = router;
