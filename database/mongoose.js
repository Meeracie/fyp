// const config = require('./../config.json');
// const userSchema = require('./schema/user.js');

// module.exports.fetchUser = async function (key) {
//     let userDB = await userSchema.findOne({ id: key });
//     if (userDB) {
//         return userDB;
//     } else {
//         userDB = new userSchema({
//             id: key,
//             registeredAt: Date.now(),
//         });
//         await userDB.save().catch((err) => console.log(err));
//         return userDB;
//     }
// };
