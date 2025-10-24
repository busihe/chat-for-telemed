"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const conversationController_1 = require("../controllers/conversationController");
const router = (0, express_1.Router)();
router.get('/', auth_1.auth, conversationController_1.listConversations);
router.post('/', auth_1.auth, conversationController_1.createConversation);
exports.default = router;
//# sourceMappingURL=conversationRoutes.js.map