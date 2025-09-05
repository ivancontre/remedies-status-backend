import { Schema, model, Document, Model, PopulatedDoc } from 'mongoose';
import moment from 'moment-timezone';
import { IUser } from './user';

export interface DayTrip {
    enabled: boolean;
    updatedAt: Date;
    numberESP32: number;
    pin: number;
};

const DayTripSchema: Schema = new Schema({
    enabled: { type: Boolean },
    updatedAt: { type: Date },
    numberESP32: { type: Number, required: true },
    pin: { type: Number, required: true }
});

export interface IStatusV3 extends Document {
    day: string;
    week: number;
    user?: PopulatedDoc<IUser>;
    morning: DayTrip;
    afternoon: DayTrip;
    nigth: DayTrip;    
};

const schema: Schema = new Schema({
    day: { 
        type: String, 
        required: [true, 'the "day" is required'] 
    },
    morning: { 
        type: DayTripSchema,
        required: true
    },
    afternoon: { 
        type: DayTripSchema,
        required: true
    },
    nigth: { 
        type: DayTripSchema,
        required: true
    },
    week: {
        type: Number
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

schema.methods.toJSON = function () {

    const { __v, _id, ...status } = this.toObject();
    status.id = _id;
    status.morning.updatedAt = moment(status.morning.updatedAt).tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss.SSS');
    status.afternoon.updatedAt = moment(status.afternoon.updatedAt).tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss.SSS');
    status.nigth.updatedAt = moment(status.nigth.updatedAt).tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss.SSS');

    return status;
};

export const StatusV3Model: Model<IStatusV3> = model<IStatusV3>('statusV3', schema);