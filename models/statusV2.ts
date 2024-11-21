import { Schema, model, Document, Model } from 'mongoose';
import moment from 'moment-timezone';

export interface IStatusV2 extends Document {
    day: string;
    enabledAM: Boolean;
    enabledPM: Boolean;
    updatedAtAM: Date;
    updatedAtPM: Date;
    week: number;
};

const schema: Schema = new Schema({
    day: { 
        type: String, 
        required: [true, 'the "day" is required'] 
    },
    enabledAM: { 
        type: Boolean, 
        default: false
    },
    enabledPM: { 
        type: Boolean, 
        default: false
    },
    updatedAtAM: { 
        type: Date
    },
    updatedAtPM: { 
        type: Date
    },
    week: {
        type: Number
    }
});

schema.methods.toJSON = function () {

    const { __v, _id, updatedAtAM, updatedAtPM, ...status } = this.toObject();
    status.id = _id;
    status.updatedAtAM = moment(updatedAtAM).tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss.SSS');
    status.updatedAtPM = moment(updatedAtPM).tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss.SSS');
    return status;

};

export const StatusV2Model: Model<IStatusV2> = model<IStatusV2>('statusV2', schema);