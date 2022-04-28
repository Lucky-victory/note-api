const {Schema,Model}=require('harpee');


const NotesSchema=new Schema({
    name:'NotesSchema',
    fields:{
        userId:String,
        title:String,
        body:String,
        createdAt:Date,
        modifiedAt:Date,
        deleted:Boolean
}
});

const Notes=new Model('Notes',NotesSchema);

module.exports=Notes;