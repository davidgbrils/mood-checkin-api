const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  mood_score: { type: Number, required: true, min: 1, max: 5 },
  mood_label: { type: String, optional: true },
  notes: { type: String, optional: true },
});

// Indexing untuk query cepat berdasarkan user_id dan date
moodSchema.index({ user_id: 1, date: -1 });

module.exports = mongoose.model('Mood', moodSchema);