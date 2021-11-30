const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: 'nostasu',
    api_key: '327851662144493',
    api_secret: '6E_omybMet9PazlGkXVYagMIAHg'
});

module.exports = cloudinary;