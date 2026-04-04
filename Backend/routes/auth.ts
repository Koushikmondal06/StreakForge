import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

router.get("/github", (req: Request, res: Response) => {
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=repo user`;
    res.redirect(url);
});

router.get("/github/callback", async (req: Request, res: Response) => {
    try {
        const code = req.query.code;

        const tokenRes = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code,
            },
            { headers: { Accept: "application/json" } }
        );

        const access_token = tokenRes.data.access_token;

        // TODO: store in DB later
        res.json({ access_token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "OAuth failed" });
    }
});

export default router;