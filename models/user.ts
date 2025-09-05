import { Schema, model, Document, Model, PopulatedDoc } from 'mongoose';

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    online: boolean;
    esp32: PopulatedDoc<IUser>[];
    user: PopulatedDoc<IUser>;
    esp32Id: string;
};

const schema: Schema = new Schema({
    name: { 
        type: String, 
        required: [true, 'the "name" is required'] 
    },
    email: { 
        type: String, 
        required:  [true, 'the "email" is required'],
        unique: true
    },
    password: { 
        type: String, 
        required:  [true, 'the "password" is required']  
    },
    online: { 
        type: Boolean, 
        default: false
    },
    esp32: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: []
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    esp32Id: { 
        type: String, 
        required:  [true, 'the "esp32Id" is required']  
    }
});

schema.methods.toJSON = function () {

    const { __v, _id, password, ...user } = this.toObject();
    user.id = _id;
    return user;

};

export const UserModel: Model<IUser> = model<IUser>('user', schema);