import Lecturers from "../models/LecturerModel.js";
import Subjects from "../models/SubjectModel.js";

export const getSubjects = async (req, res) => {
  const userData = req.userData;
  const adminId = userData.adminId;
  console.log((adminId));
  console.log("hello guys");
  if (!adminId) return res.sendStatus(401);

  
  try {
    const subjects = await Subjects.findAll();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const getSingleSubject = async (req, res) => {
  const userData = req.userData;
  const adminId = userData.adminId;
  if (!adminId) return res.sendStatus(401);

  const id = req.params.id;

  try {
    const subject = await Subjects.findOne({
      where: {
        id: id,
      },
    });
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const addSubject = async (req, res) => {
  const userData = req.userData;
  const adminId = userData.adminId;
  if (!adminId) return res.sendStatus(401);

  const { name, lecturerId } = req.body;
  if (!name || !lecturerId) return res.sendStatus(400);

  try {
    // Search Lecturer
    const lecturer = await Lecturers.findOne({
      where: {
        id: lecturerId,
      },
    });
    if (!lecturer)
      return res.status(404).json({ message: "Lecturer not found" });

    await Subjects.create({
      name: name,
      lecturerId: lecturer.id,
    });
    res.json({ message: "Successfully created a new subject" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const deleteSubject = async (req, res) => {
  const userData = req.userData;
  const adminId = userData.adminId;
  if (!adminId) return res.sendStatus(401);

  const id = req.params.id;
  if (!id) return res.sendStatus(400);

  try {
    const subject = await Subjects.destroy({
      where: {
        id: id,
      },
    });
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    return res.status(200).json({ message: "Subject successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const updateSubject = async (req, res) => {
  const userData = req.userData;
  const adminId = userData.adminId;
  if (!adminId) return res.sendStatus(401);

  const id = req.params.id;
  const { name, lecturerId } = req.body;
  if (!id || !name || !lecturerId) return res.sendStatus(400);

  try {
    const subject = await Subjects.findOne({
      where: {
        id: id,
      },
    });
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    await Subjects.update(
      {
        name: name,
        lecturerId: lecturerId,
      },
      {
        where: {
          id: subject.id,
        },
      }
    );

    return res.status(200).json({ message: "Subject successfully updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};
