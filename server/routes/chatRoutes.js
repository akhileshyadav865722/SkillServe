const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { accessConversation, fetchConversations, sendMessage, allMessages, deleteMessage, deleteConversation, pinConversation } = require('../controllers/chatController');

router.post('/conversation/create', protect, accessConversation);
router.get('/conversation', protect, fetchConversations);
router.delete('/conversation/:conversationId', protect, deleteConversation);
router.put('/conversation/:conversationId/pin', protect, pinConversation);

router.post('/message/send', protect, sendMessage);
router.get('/message/:conversationId', protect, allMessages);
router.delete('/message/:messageId', protect, deleteMessage);

module.exports = router;
