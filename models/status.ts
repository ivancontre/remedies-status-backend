import { Schema, model, Document, Model } from 'mongoose';
import moment from 'moment-timezone';

export interface IStatus extends Document {
    day: string;
    morning: string;
    afternoon: string;
};

const schema: Schema = new Schema({
    day: { 
        type: String, 
        required: [true, 'the "day" is required'] 
    },
    morning: { 
        type: String, 
        required: [true, 'the "morning" is required'] 
    },
    afternoon: { 
        type: String, 
        required: [true, 'the "afternoon" is required'] 
    },
    updatedat_morning: { 
        type: Date
    },
    updatedat_afternoon: { 
        type: Date
    }
});

schema.methods.toJSON = function () {

    const { __v, _id, updatedat_morning, updatedat_afternoon, ...status } = this.toObject();
    status.id = _id;
    status.updatedat_morning = moment(updatedat_morning).tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss.SSS');
    status.updatedat_afternoon = moment(updatedat_afternoon).tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss.SSS');
    return status;

};

export const StatusModel: Model<IStatus> = model<IStatus>('status', schema);