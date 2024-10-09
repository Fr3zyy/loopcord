import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true
  },
  policyAccepted: {
    type: Boolean,
    default: false
  },
  acceptedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

userSchema.pre('save', function(next) {
  if (this.isModified('policyAccepted') && this.policyAccepted) {
    this.acceptedAt = new Date();
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;