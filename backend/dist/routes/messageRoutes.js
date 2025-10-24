"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const messageController_1 = require("../controllers/messageController");
const router = (0, express_1.Router)();
router.get('/:conversationId', auth_1.auth, messageController_1.listMessages);
router.post('/', auth_1.auth, messageController_1.sendMessage);
router.post('/read/:conversationId', auth_1.auth, messageController_1.markRead);
router.post('/read-one/:conversationId?/:messageId?', auth_1.auth, messageController_1.markReadOne);
exports.default = router;
//# sourceMappingURL=messageRoutes.js.map