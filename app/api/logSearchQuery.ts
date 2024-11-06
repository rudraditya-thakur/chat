import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

// Define the path to the log file
const filePath = path.join(process.cwd(), "public", "search_queries.txt");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { query } = req.body;

        // Ensure query exists and isn't empty
        if (!query || typeof query !== "string") {
            return res.status(400).json({ error: "Invalid query" });
        }

        // Append the search query to the text file
        fs.appendFile(filePath, `${query}\n`, (err) => {
            if (err) {
                console.error("Failed to log search query:", err);
                return res.status(500).json({ error: "Failed to log search query" });
            }
            return res.status(200).json({ success: true });
        });
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
