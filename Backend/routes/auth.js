"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const githubService_1 = require("../services/githubService");
const router = express_1.default.Router();
router.get("/github", (req, res) => {
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=repo user`;
    res.redirect(url);
});
router.get("/github/callback", async (req, res) => {
    try {
        if (!req.query.code) {
            return res.status(400).json({ error: "No code provided" });
        }
        const code = req.query.code;
        const tokenRes = await axios_1.default.post("https://github.com/login/oauth/access_token", {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
        }, { headers: { Accept: "application/json" } });
        if (!tokenRes.data.access_token) {
            return res.status(400).json({ error: "Failed to get access token" });
        }
        const access_token = tokenRes.data.access_token;
        const user = await (0, githubService_1.getUser)(access_token);
        res.redirect(`http://localhost:5173/dashboard?token=${access_token}`);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "OAuth failed" });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map