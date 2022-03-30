import Projects from "../models/ProjectModel.js";
import Subjects from "../models/SubjectModel.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Projects.findAll();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const getSingleProject = async (req, res) => {
  const id = req.params.id;

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
  const { name, description, startDate, endDate, subjectId } = req.body;
  if (!name || !description || !startDate || !subjectId)
    return res.sendStatus(400);

  try {
    // Search Subject
    const subject = await Subjects.findOne({
      where: {
        id: subjectId,
      },
    });
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    await Projects.create({
      name: name,
      description: description,
      startDate: startDate,
      endDate: endDate,
      subjectId: subject.id,
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
