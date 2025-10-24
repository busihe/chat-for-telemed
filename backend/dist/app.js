"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const conversationRoutes_1 = __importDefault(require("./routes/conversationRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, 'docs', 'openapi.yaml'));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/conversations', conversationRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
exports.default = app;
//# sourceMappingURL=app.js.map