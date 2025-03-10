export const getUsers = async (req, res) => {
  try {
    res.status(200).json({ message: "User route working!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
