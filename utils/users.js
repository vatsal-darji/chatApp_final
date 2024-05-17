const users = [];

//join user to the chat
const joinUser = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);

  return user;
};

//get current user
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

//when user leaves

const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0]; //instead of returning the whole array just return the user
  }
};

//get room users
const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  joinUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
