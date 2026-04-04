
import axios from "axios";

export const getUser = async (token: string) => {
    const res = await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};
export const getRepos = async (token: string) => {
    const res = await axios.get("https://api.github.com/user/repos", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};
export const getCommits = async (
    token: string,
    owner: string,
    repo: string
) => {
    const res = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return res.data;
};