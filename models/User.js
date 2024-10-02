// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
