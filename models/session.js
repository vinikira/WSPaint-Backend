(function() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var Session = new Schema({
        create_at: {
            type: Date,
            required: true,
            default: Date.now
        },
        opened: {
          type: Boolean,
          default: true
        },
        users: [
          {
            user: {
                type: String,
                required: true
            },
            color: {
                type: String,
                required: true
            },
            _id: false
          }
        ],
        draw: [String]
    });

    Session.statics.pushUserIfNotExists = function (id, user, callback){
        let self = this;
        let where = {_id:id, 'users.user': user.user};
        self.findOne(where, (err, sess)=>{
            if(sess){
                console.log('usuario existe');
                return callback(err, sess);
            }else{
                console.log('não achou vai criar');
                let modify = {$push: {'users': user}};
                let options = {safe: true, upsert:true, new:true};
                where = {_id:id};
                self.findOneAndUpdate(where, modify, options, (err1, data)=>{
                    console.log(data);
                    callback(err1, data);
                });
            }
        });
    };

    module.exports = mongoose.model('session', Session);
})();
