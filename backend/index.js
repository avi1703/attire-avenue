const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); 
const multer = require("multer");
const path = require("path");
const cors = require('cors'); 

require('dotenv').config();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors()); 

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error));


app.get("/", (req, res) => {
    res.send("Express app is running") 
})

 
const storage = multer.diskStorage({
    destination: "./Upload/images",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })


app.use('/images', express.static('Upload/images'))

app.post("/Upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})



const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    avialable: {
        type: Boolean,
        default: true,
    },
})

app.post("/addproduct", async (req, res) => {
    try {
        let products = await Product.find({});
        let id;

        if (products.length > 0) {
            let lastProduct = products[products.length - 1];
            id = lastProduct.id + 1;
        } else {
            id = 1;
        }

        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        console.log("Saving product:", product);
        await product.save();
        console.log("Product saved successfully");

        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error in adding product:", error);
        res.status(500).json({
            success: false,
            error: "Failed to add product",
        });
    }
});



app.post("/removeproduct", async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    })
})


app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products)
})

const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})


const jwtSecret = process.env.JWT_SECRET;

app.post('/signup', async (req, res) => {

    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ sucess: false, errors: "There is already an existing account on this address" })
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })

    await user.save();

    const data = {
        user: {
            id: user.id,
        }
    }

    const token = jwt.sign(data, jwtSecret);

    res.json({ sucess: true, token });
})


app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, jwtSecret);
            res.json({ sucess: true, token });
        }
        else {
            res.json({ sucess: false, errors: "Wrong Password" });
        }
    } 
    else {
        res.json({ sucess: false, errors: "Wrong Email Id" });
    }
})

app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollections Fetched!");   
    res.send(newcollection); 
}) 

app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4); 
    console.log("Popular In Women Fetched!");
    res.send(popular_in_women);
})

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Please authenticate using valid token" })
    }
    else {
        try {
            const data = jwt.verify(token, jwtSecret);
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: "Please authenticate using a valid token" })
        }
    }
}

app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("Added", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send({ message: "Item Added Successfully!" });
}) 

app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("Removed", req.body.itemId);  
    let userData = await Users.findOne({ _id: req.user.id }); 
    if (userData.cartData[req.body.itemId] > 0) 
        userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send({ message: "Item Removed Successfully!" });
})

app.post('/clearcart', fetchUser, async (req, res) => {
    try {
        console.log("Removing all items from cart for user", req.user.id);
        
        // Find the user in the database
        let userData = await Users.findOne({ _id: req.user.id });

        // Ensure user data and cartData exist
        if (userData && userData.cartData) {
            // Reset all quantities in cartData to 0
            for (let itemId in userData.cartData) {
                userData.cartData[itemId] = 0;
            }

            // Update the user's cartData in the database
            await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });

            // Send a success response back to the client
            res.send({ message: "All items removed from cart successfully!" });
        } else {
            // Handle cases where user data or cart data is not found
            res.status(404).send({ message: "User or cart data not found!" });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error removing all items from cart:", error);
        res.status(500).send({ message: "An error occurred while removing all items from the cart." });
    }
});



app.post('/getcart', fetchUser, async (req, res) => {
    console.log("GetCart");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
}) 


app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    }
    else {
        console.log("Error : " + error);
    }
})

module.exports = app;