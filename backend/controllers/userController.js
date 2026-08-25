import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import pool from "../config/db.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    try {
        const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword]
        );

        const token = createToken(result.insertId);
        res.status(201).json({
            token,
            user: { id: result.insertId, username, email },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const token = createToken(user.id);
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, username, email FROM users WHERE id = ?", [req.userId]);
        if (!rows[0]) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user: rows[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
