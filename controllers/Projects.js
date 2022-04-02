import Lecturers from "../models/LecturerModel.js";
import Projects from "../models/ProjectModel.js";
import Subjects from "../models/SubjectModel.js";

export const getProjects = async (req, res) => {
  // Get Data from JWT Middleware
  const userData = req.userData;

  const lecturerId = userData.lecturerId;
  console.log(userData);
  if (!lecturerId) return res.sendStatus(401);

  try {
    // Search Projects
    const projects = await Projects.findAll({
      where: {
        lecturerId: lecturerId,
      },
    });
    if (!projects) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
  // if (userData.lecturerId) {
  // } else {
  //   const studentId = userData.studentId;
  //   if (!studentId) return res.sendStatus(401);

  //   try {
  //     // Search Projects
  //     const projects = await Projects.findAll({
  //       where: {
  //         studentId: studentId,
  //       },
  //     });
  //     res.status(200).json(projects);
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ message: "Internal Server Error", details: error });
  //   }
  // }
};

export const getSingleProject = async (req, res) => {
  // Get Data from JWT Middleware
  const id = req.params.id;
  
  if (!id) return res.sendStatus(400);

  try {
    const project = await Projects.findOne({
      where: {
        id: id,
      },
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const addProject = async (req, res) => {
  // Get Data from JWT Middleware
  const userData = req.userData;
  const lecturerId = userData.lecturerId;
  if (!lecturerId) return res.sendStatus(401);
  
  const { name, description, startDate, endDate, subjectId } = req.body;
  if (!name || !description || !startDate || !subjectId) return res.sendStatus(400);

  try {
    // Search Subject
    const subject = await Subjects.findOne({
      where: {
        id: subjectId,
        lecturerId: lecturerId
      },
    });
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    
    // Generate Random Unique Code
    let projectKey = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      projectKey += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }    
    
    await Projects.create({
      name: name,
      description: description,
      projectKey: projectKey,
      startDate: startDate,
      endDate: endDate,
      subjectId: subject.id,
      lecturerId: lecturerId,
    });
    
    res.status(200).json({ message: "Successfully created a new project" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const deleteProject = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.sendStatus(400);

  try {
    const project = await Projects.destroy({
      where: {
        id: id,
      },
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    return res.status(200).json({ message: "Project successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const updateProject = async (req, res) => {
  const id = req.params.id;
  const { name, description, endDate, subjectId } = req.body;
  if (!id || !name || !description || !subjectId) return res.sendStatus(400);

  try {
    const project = await Projects.findOne({
      where: {
        id: id,
      },
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const subject = await Subjects.findOne({
      where: {
        id: subjectId,
      },
    });
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    await Projects.update(
      {
        name: name,
        description: description,
        endDate: endDate,
        subjectId: subject.id,
      },
      {
        where: {
          id: project.id,
        },
      }
    );

    return res.status(200).json({ message: "Project successfully updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};
