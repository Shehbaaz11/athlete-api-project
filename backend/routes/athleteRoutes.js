const express = require('express');

const Router = express.Router();
const Athlete = require("../models/athlete")

Router.post("/save-athlete",async (req,res)=>{
    try{
        const newAthlete = new Athlete(req.body);
        await newAthlete.save();
        res.status(201).json ({message: "Athlete saved"})
    }
    catch (err){
        res.status(500).json({message: "Athlete not saved"})
    }
});

Router.get("/saved-athletes",async (req,res)=>{
      let athletesaved = await Athlete.find();
      res.status(200).json(athletesaved);
    
})

Router.delete("/delete-athlete/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await Athlete.findByIdAndDelete(id);
      res.status(200).json({ message: "Athlete deleted" });
    } catch (error) {
      console.error("Error deleting athlete:", error);
      res.status(500).json({ message: "Failed to delete athlete" });
    }
  });
  
module.exports = Router;

