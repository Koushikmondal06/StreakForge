import express, { Request, Response } from "express";
import axios from "axios";
import { getUser } from "../services/githubService";

const router = express.Router();

router.get("/github", (req: Request, res: Response) => {
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=repo user`;
    res.redirect(url);
});

router.get("/github/callback", async (req: Request, res: Response) => {
    try {
        if (!req.query.code) {
            return res.status(400).json({ error: "No code provided" });
        }

        const code = req.query.code as string;

        const tokenRes = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code,
            },
            { headers: { Accept: "application/json" } }
        );

        if (!tokenRes.data.access_token) {
            return res.status(400).json({ error: "Failed to get access token" });
        }

        const access_token = tokenRes.data.access_token;
        const user = await getUser(access_token);


        res.redirect(`http://localhost:5173/dashboard?token=${access_token}`);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "OAuth failed" });
    }
});
export default router;