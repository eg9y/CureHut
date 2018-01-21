// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)
const _ = require("lodash");
class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, username, room, spectate) {
    const user = { id, username, room, spectate };
    this.users.push(user);
    return user;
  }
  removeUser(id) {
    const user = this.getUser(id);
    if (user) {
      this.users = this.users.filter(user => user.id !== id);
    }
    return user;
  }
  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }
  getUserList(room) {
    console.log("user", this.users);
    const users = this.users.filter(
      user => user.room === room && user.spectate == "false"
    );
    const namesArray = users.map(user => {
      return user.username;
    });
    console.log("wtf", users);
    return namesArray;
  }

  getRoomList() {
    var rooms = this.users.map(user => {
      return user.room;
    });
    rooms = _.uniq(rooms);
    return rooms;
  }
}

module.exports = { Users };
