import { Schema, model, Document, Model, PopulatedDoc } from 'mongoose';

export interface ILaunch extends Document{
    A: boolean;
    B: boolean;
    C: boolean;
};

const schema: Schema = new Schema({
    A: { 
        type: Boolean
    },
    B: { 
        type: Boolean
    },
    C: { 
        type: Boolean
    }
});

schema.methods.toJSON = function () {

    const { __v, _id, ...launch } = this.toObject();
    launch.id = _id;
    return launch;

};

export const LaunchModel: Model<ILaunch> = model<ILaunch>('launch', schema);