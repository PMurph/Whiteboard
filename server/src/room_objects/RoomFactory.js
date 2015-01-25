'use strict';

var RoomFactory = function(creatingUser) {
    "use strict"
    this.creatingUser = creatingUser;
};

RoomFactory.prototype = {
    initialize: function() {
        creatingUser: String
    },
    _createNewRoom: function(creatingUser) {
        var anoncreatingUser = new this.RoomModel({
            this.creatingUser: creatingUser,
            anonymous: true
        });

        return anoncreatingUser;
    },
});

module.exports = RoomFactory;