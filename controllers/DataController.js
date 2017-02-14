var Post = require('../models/SinglePost');

class Data {
    constructor(){
        
    }
    getLatestList(page, res) {
        try{
        Post.find({})
        .sort({createdAt: -1})
        .exec((err, data) =>{
            try{
            if(err){
                //res.json({error: "error"})
               // res.status(500).json({fail: "fail"})
            }else{
                res.json(data);
            }
            }catch(e){
                console.log(e)
            }
        });
        }catch(e){
            console.log('---------', e);
        }
    }
    
    getLast(id, res){
        Post.find({_id: id}, function(err, data){
            if(err == null && data && data.length){
                res.json(data);
            }else {
                res.status(404).json({error: err || "No data with that ID"})
            }
        });
    }
}

module.exports = Data;