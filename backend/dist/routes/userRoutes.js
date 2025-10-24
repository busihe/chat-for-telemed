"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.get('/', auth_1.auth, (0, auth_1.requireRole)(['admin']), userController_1.listUsers);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map