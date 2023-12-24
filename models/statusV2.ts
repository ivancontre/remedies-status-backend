import { Schema, model, Document, Model } from 'mongoose';
import moment from 'moment-timezone';

export interface IStatusV2 extends Document {
    day: string;
    enabledAM: Boolean;
    enabledPM: Boolean;
};

const schema: Schema = new Schema({
    day: { 
        type: String, 
        required: [true, 'the "day" is required'] 
    },
    enabledAM: { 
        type: Boolean, 
        required: [true, 'the "enabledAM" is required'],
        default: false
    },
    enabledPM: { 
        type: Boolean, 
        required: [true, 'the "enabledPM" is required'],
        default: false
    },
    updatedatAM: { 
        type: Date
    },
    updatedatPM: { 
        type: Date
    }
});

schema.methods.toJSON = function () {

    const { __v, _id, updatedatAM, updatedatPM, ...status } = this.toObject();
    status.id = _id;
    status.updatedatAM = moment(updatedatAM).tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss.SSS');
    status.updatedatPM= moment(updatedatAM).tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss.SSS');
    return status;

};

export const StatusV2Model: Model<IStatusV2> = model<IStatusV2>('statusV2', schema);