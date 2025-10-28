const express = require('express');
const router = express.Router();
const Mood = require('../models/mood');
const Joi = require('joi');

// Schema validation untuk POST
const moodValidation = Joi.object({
  user_id: Joi.string().required(),
  mood_score: Joi.number().integer().min(1).max(5).required(),
  mood_label: Joi.string().optional(),
  notes: Joi.string().optional(),
});

// POST /mood - Simpan mood
router.post('/', async (req, res) => {
  const { error } = moodValidation.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const mood = new Mood(req.body);
    await mood.save();
    res.status(201).json(mood);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /mood/:user_id - Riwayat mood
router.get('/:user_id', async (req, res) => {
  try {
    const moods = await Mood.find({ user_id: req.params.user_id }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /summary/:user_id - Rata-rata mood per minggu/bulan (optional)
router.get('/summary/:user_id', async (req, res) => {
  try {
    const moods = await Mood.aggregate([
      { $match: { user_id: req.params.user_id } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            week: { $week: '$date' },
          },
          averageMood: { $avg: '$mood_score' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.week': -1 } },
    ]);
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;