const sqlite = require('sqlite3').verbose();
module.exports = (function (){
    const db = new sqlite.Database(__dirname+"/UserDB.db",err =>{
        if (err){
            console.error(err.message)
        }
        console.log("Connected to the used database")
    });


    const CreateUser = function(Pseudo, Password) {
      return new Promise((resolve, reject ) =>{
          db.run("INSERT INTO User(Pseudo, Password, WonPartNumber, Score) VALUES(?, ?, 0,0)", [Pseudo, Password], err=>{
              if (err){
                  reject(err)
              }else{
                  resolve(this.lastID)
              }
          });
      })
    };

    const ConnectUser = function (Pseudo, Password) {
        return new Promise((resolve , reject) =>{
            db.get("SELECT Pseudo,WonPartNumber, Score FROM User WHERE Pseudo=? AND Password=?", [Pseudo, Password], (err, res) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(res);
                }
            });
        })
    };

    return {ConnectUser, CreateUser};
})();
