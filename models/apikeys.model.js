const {Schema,Model}=require('harpee');


const NotesSchema=new Schema({
    name:'NotesSchema',
    fields:{
        userId:String,
        key:String,
        createdAt:Date,
expired:Boolean,
expiresIn:Number
}
});

const ApiKeys=new Model('ApiKeys',NotesSchema);

module.exports=ApiKeys;