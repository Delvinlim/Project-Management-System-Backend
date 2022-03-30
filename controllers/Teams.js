import Projects from "../models/ProjectModel.js";
import Students from "../models/StudentModel.js";
import Teams from "../models/TeamModel.js";

export const getTeams = async (req, res) => {
  try {
    const teams = await Teams.findAll();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const joinTeams = async (req, res) => {
  const uniqueCode = req.params.uniqueCode;
  const studentId = req.body.studentId;
  if (!uniqueCode || !studentId) return res.sendStatus(400);

  try {
    const student = await Students.findOne({
      where: {
        id: studentId,
      },
    });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const team = await Teams.findOne({
      where: {
        uniqueCode: uniqueCode,
      },
    });
    if (!team) return res.status(404).json({ message: "Team not found" });

    await Teams.create({
      name: team.name,
      uniqueCode: uniqueCode,
      projectId: team.projectId,
      studentId: student.id,
    });

    res.status(200).json({ message: "Successfully joined a team" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const addTeams = async (req, res) => {
  try {
    const { name, projectId, studentId } = req.body;
    if (!name || !projectId || !studentId) return res.sendStatus(400);

    // Generate Random Unique Code
    let uniqueCode = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      uniqueCode += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }

    const project = await Projects.findOne({
      where: {
        id: projectId,
      },
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const student = await Students.findOne({
      where: {
        id: studentId,
      },
    });
    if (!student) return res.status(404).json({ message: "Student not found" });

    await Teams.create({
      name: name,
      uniqueCode: uniqueCode,
      projectId: project.id,
      studentId: student.id,
    });
    res.status(200).json({ message: "Successfully created a new team" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

// TODO cannot get by id because many2many relationship table doesn't generate id ==> Solution is query by project id and student id
export const deleteTeams = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.sendStatus(404);

  try {
    const teams = await Teams.destroy({
      where: {
        id: id,
      },
    });
    if (!teams) return res.status(404).json({ message: "Team not found" });

    return res.status(200).json({ message: "Team successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const updateTeams = async (req, res) => {
  const { name, uniqueCode, projectId, studentId } = req.body;
  if (!name || !uniqueCode) return res.sendStatus(400);

  try {
    const project = await Projects.findOne({
      where: {
        id: projectId,
      },
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const student = await Students.findOne({
      where: {
        id: studentId,
      },
    });
    if (!student) return res.status(404).json({ message: "Student not found" });

    await Teams.update(
      {
        name: name,
        uniqueCode: uniqueCode,
      },
      {
        where: {
          projectId: project.id,
          studentId: student.id,
        },
      }
    );
    res.status(200).json({ message: "Team successfully updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};
