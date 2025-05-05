// Modelos
const Follow = require("../models/follow");

const followUserIds = async (userId) => {
  try {
    // Sacar info seguimiento 
    let following = await Follow.find({ user: userId })
      .select({ followed: 1, "_id": 0 });
    let followers = await Follow.find({ followed: userId })
      .select({ user: 1, "_id": 0 });

    if (!following) {
      following = [];
    }
    if (!followers) {
      followers = [];
    }
    // Porcesar array de identificadores
    let following_clean = [];
    let followers_clean = [];
    

    following.forEach((follow) => {
      following_clean.push(follow.followed);
    });
    followers.forEach((follow) => {
      followers_clean.push(follow.user);
    });
    // Devolver resultado

    let res = {
      following_clean,
      followers_clean
    }

    return res;
  } catch (error) {
    return {};
  }
};

const followThisUser = async (identityUserId, profilUserId) => {
  try {
    // Sacar info seguimiento 
    let following = await Follow.findOne({ user: identityUserId, followed: profilUserId })
      .select({ followed: 1, "_id": 0 });
    let followers = await Follow.find({ followed: identityUserId, user: profilUserId })
      .select({ user: 1, "_id": 0 });

    return {
      following,
      followers
    }
  } catch (error) {
    return {};
  }
};

module.exports = {
  followUserIds,
  followThisUser,
};
