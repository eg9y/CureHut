// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)
const _ = require("lodash");
class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, username, room) {
    const user = { id, username, room };
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
    const users = this.users.filter(user => user.room === room);
    const namesArray = users.map(user => {
      return user.username;
    });
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
