const userModel = require('../DB/userSchema');
const contactModel = require('../DB/contactSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const registerController = async(req, res) => {
    try {
        const user = await userModel.findOne({ name: req.body.name });
        if (user) {
            return res.status(200).send({
                success: false,
                message: 'User with the same name already registered'
            });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Explicitly define the fields you want to save
        const newUser = new userModel({
            name: req.body.name,
            password: hashedPassword,
            // Add other fields as needed
        });

        await newUser.save();

        res.status(200).send({
            message: 'Successfully registered',
            success: true
        });
    } catch (err) {
        // Log the error for debugging purposes
        console.error(err);
        res.status(500).send({
            success: false,
            message: 'Error in registration'
        });
    }
};

const loginController = async(req, res) => {
    try {
        console.log(req.body);
        const user = await userModel.findOne({ name: req.body.name });
        console.log("This is Login user created -> ", user)
        if (!user) {
            return res.status(200).send({ message: 'User not found', success: false });
        }
        const ismatch = await bcrypt.compare(req.body.password, user.password);
        if (!ismatch) {
            return res.status(200).send({ message: 'Invalid Credntials', success: false });
        }
        const secretKey = 'yourSecretKeyHere';
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1d' })
        res.status(200).send({
            message: "Successfully login",
            success: true,
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error in login" })
    }
}
const getuserController = async(req, res) => {
    try {
        if (req.userId) {
            return res.status(200).json({
                success: true,
                message: 'User is logged in',
            });
        } else {
            return res.status(200).json({
                success: false,
                message: 'User is not logged in',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error in Getting Data',
            err,
        });
    }
}
const contactDataController = async(req, res) => {
    try {
        const { name, generatedId } = req.body;
        const User = await userModel.findById(req.userId);
        const contactowner = await contactModel.findOne({ UserID: User._id });
        const oppositeperson = await userModel.findOne({ name: name })
        console.log(oppositeperson);
        if (!oppositeperson) {
            res.status(200).send({
                success: false,
                message: 'This Persone in not available on this platform'
            })
        } else {
            const oppositecontact = await contactModel.findOne({ name: name });
            if (!oppositecontact) {
                const contact = new contactModel({
                    UserID: oppositeperson._id,
                    name: name,
                })
                const newContact = {
                    nanoid: generatedId,
                    contactuser: User.name,
                    chats: [],
                };
                contact.contacts.push(newContact);
                await contact.save();
            } else {
                let check = false;
                const arr = oppositecontact.contacts;
                arr.map((val) => {
                    if (val.contactuser == User.name) {
                        check = true;
                    }
                })
                if (check) {
                    return res.status(200).send({
                        success: false,
                        message: "User with same name already exists"
                    })
                }
                if (!check) {
                    oppositecontact.contacts.push({
                        nanoid: generatedId,
                        contactuser: User.name,
                        chats: [],
                    })
                    await oppositecontact.save();
                }
            }
        }
        const userID = User._id;
        const ownername = User.name;
        if (!contactowner) {
            const contact = new contactModel({
                UserID: userID,
                name: ownername,
            })
            const newContact = {
                nanoid: generatedId,
                contactuser: name,
                chats: [],
            };
            contact.contacts.push(newContact);
            await contact.save();
        } else {
            let check = false;
            const arr = contactowner.contacts;
            arr.map((val) => {
                if (val.contactuser == name) {
                    check = true;
                }
            })
            if (check) {
                return res.status(200).send({
                    success: false,
                    message: "User with same name already exists"
                })
            }
            if (!check) {
                contactowner.contacts.push({
                    nanoid: generatedId,
                    contactuser: name,
                    chats: [],
                })
                await contactowner.save();
            }
        }
        res.status(201).send({
            success: true,
            message: 'Successfully saved contact',
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error in Contact Save',
        });
    }
};

const savedcontactsController = async(req, res) => {
    try {
        const User = await contactModel.findOne({ UserID: req.userId });
        const arr = User.contacts;
        res.status(200).send({
            success: true,
            message: "Successfully retrieved contacts",
            arr
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in contacts retrieval"
        })
    }
}
module.exports = { loginController, registerController, getuserController, contactDataController, savedcontactsController };