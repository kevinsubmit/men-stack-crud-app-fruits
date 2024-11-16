// NPM packages
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import methodOverride from "method-override";

dotenv.config();

// Custom modules
import "./db/connection.js";
import Fruit from "./models/fruit.js";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));

// GET
// Home route
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// New fruit template route
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});

// Display single fruit
app.get("/fruits/:fruitId", async (req, res) => {
  try {
    const id = req.params.fruitId;
    const fruit = await Fruit.findById(id);

    res.status(200).render("fruits/show.ejs", { fruit: fruit });
  } catch (error) {
    console.error(error);
    res.status(404).send("Fruit not found");
  }
});

app.get("/fruits/:fruitId/edit", async (req, res) => {
  try {
    const id = req.params.fruitId;
    const fruit = await Fruit.findById(id);

    res.status(200).render("fruits/edit.ejs", { fruit: fruit });
  } catch (error) {
    console.error(error);
    res.status(500).send("Cannot load the edit form");
  }
});

// Fruits index page
app.get("/fruits", async (req, res) => {
  try {
    const allFruits = await Fruit.find({});
    res.render("fruits/index.ejs", { fruits: allFruits });
  } catch (error) {
    console.error(error);
    res.send("There was an error getting all fruits");
  }
});

// POST
app.post("/fruits", async (req, res) => {
  try {
    req.body.isReadyToEat = req.body.isReadyToEat === "on" ? true : false;
    const newFruit = await Fruit.create(req.body);

    res.status(200).redirect("/fruits");
  } catch (error) {
    console.error(error);
    res.status(418).send("There was an error with creating a new fruit");
  }
});

// PUT
app.put("/fruits/:fruitId", async (req, res) => {
  try {
    const id = req.params.fruitId;
    req.body.isReadyToEat = req.body.isReadyToEat === "on" ? true : false;
    const updateData = req.body;
    const updatedFruit = await Fruit.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).redirect("/fruits")
  } catch (error) {
    console.error(error);
    res.status(501).send("Error updating fruit");
  }
});

// DELETE
app.delete("/fruits/:fruitId", async (req, res) => {
  try {
    const id = req.params.fruitId;
    const deletedFruit = await Fruit.findByIdAndDelete(id);

    // Custom errors
    // if (!deletedFruit) {
    //   throw new Error('Some specific error')
    // }

    res.status(200).redirect("/fruits");
  } catch (error) {
    console.error(error);
    res.status(500).send("Could not delete the fruit");
  }
});

app.listen(3000, () => {
  console.log("Listening on 3000...");
});
