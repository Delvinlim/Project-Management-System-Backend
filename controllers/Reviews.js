import Reviews from "../models/ReviewModel.js";

export const getReviews = async (req, res) => {
  try {
    const reviews = await Reviews.findAll();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const addReviews = async (req, res) => {
  try {
    const image = req.file.path;
    const { name, comment  } = req.body;
    if (!image || !name || !comment) return res.sendStatus(400);
    await Reviews.create({
      name: name,
      comment: comment,
      image: image,
    });
    res.status(200).json({ message: "Successfully created a new reviews" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const deleteReviews = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.sendStatus(400);

  try {
    const reviews = await Reviews.destroy({
      where: {
        id: id,
      },
    });
    if (!reviews) return res.status(404).json({ message: "Subject not found" });

    return res.status(200).json({ message: "Reviews successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", details: error });
  }
};

export const updateReviews = async (req, res) => {
  const id = req.params.id;
  const { name, comment } = req.body;
  const image = req.file.path;
  if (!id || !name || !comment || !image) return res.sendStatus(400);

  try {
    const review = Reviews.findOne({
      where: {
        id: id,
      },
    });
    if (!review) return res.status(404).json({ message: "Reviews not found" });

    await Reviews.update(
      {
        name: name,
        comment: comment,
        image: image,
      },
      {
        where: {
          id: review.id,
        },
      }
    );
    return res.status(200).json({ message: "Review successfully updated" });
  } catch (error) {}
};
