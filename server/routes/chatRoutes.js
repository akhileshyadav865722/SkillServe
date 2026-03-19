const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { accessConversation, fetchConversations, sendMessage, allMessages } = require('../controllers/chatController');

router.post('/conversation/create', protect, accessConversation);
router.get('/conversation', protect, fetchConversations);
router.post('/message/send', protect, sendMessage);
router.get('/message/:conversationId', protect, allMessages);

module.exports = router;
