const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const config = require("config");

const data_User_From_DB = require(path.join(__dirname, "../../", "/models/UserModel")); //"../models/user"
const data_Profile_From_DB = require(path.join(__dirname, "../../", "/models/profileUsersModel")); //"../models/profile"
const bcrypt = require(path.join(__dirname, "../../", "/helpers/encode_password")); //"../helpers/encode_password"

var router = express.Router();

//---------------Check role----------------
router.use(function(req, res, next) {
    var tokenBearer = req.headers['authorization'];
    var bearer = null;
    if (typeof tokenBearer !== 'undefined') {
        tokenBearerSplit = tokenBearer.split(' ');
        bearer = tokenBearerSplit[1];
    }

    var token = req.body.token || req.query.token || bearer;
    if (!token) res.status(403).json({ notification: "no token" });
    else {
        jwt.verify(token, config.get("jsonwebtoken.codesecret"), function(err, decoded) {
            var id = decoded._id;
            data_User_From_DB.getUserByIdToCheckRole(id, function(result) {
                if (!result) res.status(403).json({ data: { success: false, notification: "token error, not found user" } });
                else {
                    console.log(result.role.name_role);
                    if (result.role.name_role == "user" && result.role.licensed == true) {
                        console.log("here");
                        decoded.role = result.role;
                        req.user = decoded;
                        next();
                    } else {
                        res.status(401).json({ data: { success: false, notification: "this account can't access" } });
                    }
                }
            })
        })
    }
})

function check_Permission(permission, name_permission, id) {
    for (i = 0; i < permission.length; i++) {
        if (permission[i].name_per == name_permission) {
            if (id == 1) {
                if (permission[i].per_detail.view == true) {
                    return true;
                }
            } else if (id == 2) {
                if (permission[i].per_detail.create == true) {
                    return true;
                }
            } else if (id == 3) {
                if (permission[i].per_detail.update == true) {
                    return true;
                }
            } else if (id == 4) {
                if (permission[i].per_detail.delete == true) {
                    return true;
                }
            }
        }
    }
    return false;
}

// API for users

router.get("/profile", function(req, res) {
    var id = req.user._id;

    data_Profile_From_DB.getProfileUserById(id, function (result) {
        if (!result) res.status(500).json({ success: false });
        else res.status(200).json({
            success: true,
            result: result
        })
    })
});

router.put("/profile", function(req, res) {
    var id = req.user._id;
    var profile = req.body;

    var name_per = profile.information.name;
    var address_per = profile.information.address;
    var avatar_url_per = profile.information.avatar_url;

    if (!name_per || name_per.trim().length == 0 || !address_per || address_per.trim().length == 0) {
        return res.status(400).json({ success: false, notification: "ban phai nhap day du thong tin" });
    }
    var data = {
        name_per : name_per,
        address_per : address_per,
        avatar_url_per : avatar_url_per
    }

    data_Profile_From_DB.updateProfileUserById(id, data, function(result) {
        if (!result) res.status(500).json({ success: false });
        else res.status(200).json({
            success: true,
            result: result
        }) 
    })
});

//-----------MODULE EXPORTS -----------
module.exports = router;