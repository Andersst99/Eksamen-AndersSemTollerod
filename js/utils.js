function validateUser(username, password) {
  if (!username || !password) return false;
  return username.length >= 3 && password.length >= 6;
}

function isLikedAlready(existingLikes, match) {
  return existingLikes.some(
    (like) =>
      like.likedUser.name === match.name && like.likedUser.age === match.age
  );
}

module.exports = {
  validateUser,
  isLikedAlready,
};
