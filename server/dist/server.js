"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cloudinary_1 = require("cloudinary");
const db_1 = __importDefault(require("./config/db"));
const file_routes_1 = __importDefault(require("./routes/file.routes"));
const app = express_1.default();
dotenv_1.default.config();
// cloudinary set up
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// connecdb
db_1.default();
// middleware 
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// test route
app.get('/', (req, res) => res.send('Hello from Express!'));
// routes
app.use('/api/files', file_routes_1.default);
// connecting to PORT
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
//# sourceMappingURL=server.js.map