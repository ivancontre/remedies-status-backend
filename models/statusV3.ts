import { Schema, model, Document, Model, PopulatedDoc } from 'mongoose';
import moment from 'moment-timezone';
import { IUser } from './user';

export interface ESP32 {
    topic: string;
    numberESP32: number;
    macESP32: string;
    pin: number;
};

export interface DayTrip {
    enabled: boolean;
    updatedAt: Date;
    servo: ESP32
    led: ESP32
};

const ESP32Schema: Schema = new Schema({
    topic: { type: String, required: true },
    numberESP32: { type: Number, required: true },
    macESP32: { type: String, required: true },
    pin: { type: Number, required: true }
});

const DayTripSchema: Schema = new Schema({
    enabled: { type: Boolean },
    updatedAt: { type: Date },
    servo: {
        type: ESP32Schema
    },
    led: {
        type: ESP32Schema
    }
});

export interface IStatusV3 extends Document {
    day: string;
    morning: DayTrip;
    afternoon: DayTrip;
    nigth: DayTrip;
    week: number;
    user?: PopulatedDoc<IUser>;
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

    const { __v, _id, morning, afternoon, nigth, esp32, ...status } = this.toObject();
    status.id = _id;
    
    status.morning = {
        enabled: morning.enabled,
        updatedAt: moment(morning.updatedAt).tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss.SSS'),
        esp32: morning.esp32
    };

    status.afternoon = {
        enabled: afternoon.enabled,
        updatedAt: moment(afternoon.updatedAt).tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss.SSS'),
        esp32: afternoon.esp32
    };

    status.nigth = {
        enabled: nigth.enabled,
        updatedAt: moment(nigth.updatedAt).tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss.SSS'),
        esp32: nigth.esp32
    };

    return status;
};

export const StatusV3Model: Model<IStatusV3> = model<IStatusV3>('statusV3', schema);