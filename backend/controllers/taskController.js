import pool from "../config/db.js";


//GET /api/task
export const getTasks=async(req,res)=>{
  try{
    const [tasks]=await pool.query(
        "SELECT * FROM tasks WHERE user_id=? ORDER BY created_at DESC",[req.userId]
    );
    res.json(tasks);
  }catch(error){
    res.status(500).json({message:error.message});
  }
};

//POST /api/task
export const createTask=async (req,res)=>{
    const {title,description}=req.body;
    if(!title?.trim()){
        return res.status(400).json({message:"Title is required" });
    }

    try{
        const [result]=await pool.query(
            "INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)",
            [req.userId,title.trim(),description || null]
        );

        const [rows]=await pool.query("SELECT * FROM tasks WHERE id=?",[result.insertId]);
        res.status(201).json(rows[0]);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

// PUT /api/task/:id
export const updateTask = async (req, res) => {
    const { title, description, status } = req.body;
    try {
      const [existing] = await pool.query(
        "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
        [req.params.id, req.userId]
      );
      if (!existing[0]) {
        return res.status(404).json({ message: "Task not found" });
      }
      await pool.query(
        `UPDATE tasks SET
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          status = COALESCE(?, status)
         WHERE id = ? AND user_id = ?`,
        [title, description, status, req.params.id, req.userId]
      );
      const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  // DELETE /api/task/:id
  export const deleteTask = async (req, res) => {
    try {
      const [result] = await pool.query(
        "DELETE FROM tasks WHERE id = ? AND user_id = ?",
        [req.params.id, req.userId]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ message: "Task deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
