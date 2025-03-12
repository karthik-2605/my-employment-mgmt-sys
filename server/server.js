const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
require("dotenv").config({path:"./.env"});
console.log("Database Config: ",process.env.DB_HOST, process.env.DB_USER,process.env.DB_PASSWORD,process.env.DB_DATABASE,process.env.DB_PORT);


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname,"..","public")));


app.get("/",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"..","public","index.html"));
});


const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT
    }    
);

db.connect((err)=>{
    if(err){
        console.error("Database connection failed");
        return;
    }
    console.log("Connected to MySQL database (via Workbench)");
})

// Sample API to test connection
app.get("/employees_info",(req,res)=>{
    db.query("SELECT * FROM employees",(err,results)=>{
        if(err){
            return res.status(500).json({err:err.message});
        }

        res.json(results);
    })
});

app.post("/employees",(req,res)=>{
    const {search_id, emp_name, gender, email,dept,address} = req.body;

    if(!search_id || !emp_name || !gender || !email || !dept || !address){
        return res.status(400).json({error:"All fields are required"});
    }

    const sql = "INSERT INTO employees (search_id,emp_name,gender,email,dept,address) VALUES (?,?,?,?,?,?)";
    const values = [search_id,emp_name,gender,email,dept,address];

    db.query(sql,values,(err,result)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }

        res.json({message:"Employee added successfully",id:result.insertId});
    })

})










app.get("/employees/:search_id",(req,res)=>{
    const {search_id} = req.params;
    console.log("Received search requrest for: ",search_id);
    db.query("SELECT * FROM employees WHERE search_id = ?",[search_id],(err,results)=>{
       if(err){
        console.error("Database error: ",err);
        res.status(500).json({error:err.message});
       }else{
        res.json(results[0]);
       }
    })
});











app.delete("/employees/:search_id",(req,res)=>{
    const {search_id} = req.params;
    console.log("Delete request received for: ",search_id);

    db.query("DELETE FROM EMPLOYEES WHERE search_id = ?",[search_id],(err,result)=>{
        if(err){
            console.log("Database error: ",err);
            res.status(500).json({error:err.message});
        }else{
            res.json({message: "Employee deleted successfully!"});
        }
    })

})










app.put("/employees/:search_id",(req,res)=>{
    const {search_id} = req.params;
    console.log("Requested for modification :",search_id);

    const {emp_name, gender, email, dept, address} = req.body;
    console.log("Received Data: ",{emp_name,gender,email,dept,address});

    if(!emp_name || !gender || !email || !dept || !address){
        res.status(400).json({error: "All fields are required for update!"});
        return;
    }

    const sql = "UPDATE EMPLOYEES SET emp_name = ?, gender = ?, email = ?, dept = ?, address = ? WHERE search_id = ?";
    const values = [emp_name,gender,email,dept,address,search_id];

    db.query(sql,values,(err,result)=>{
        if(err){
            res.status(500).json({error:"Employee not found"});
            return;
        }else{
            res.json({message: "Employee updated successfully!"});
        }
    });

});


app.listen(3000,()=>{
    console.log("Server running on port 3000");
});
