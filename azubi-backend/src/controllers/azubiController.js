import * as azubiService from "../services/azubiService.js";

export const getAzubis = async (req, res) => {
  try {
    const azubis = await azubiService.getAzubis();
    res.status(200).json(azubis);
  } catch (err) {
    console.error("Error fetching Azubis:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createAzubis = async (req, res) => {
  const id_person = req.params.id_person;

  try {
    const createdAzubi = await azubiService.createAzubis(id_person);
    if (createdAzubi.length > 0) {
      res.status(200).json(createdAzubi);
    } else {
      res.status(404).json({ message: "Azubi not found" });
    }
  } catch (err) {
    console.error("Error creating Azubi:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAzubis = async (req, res) => {
  const id_person = req.params.id_person;

  try {
    const updatedAzubi = await azubiService.deleteAzubis(id_person);
    if (updatedAzubi.length > 0) {
      res.status(200).json(updatedAzubi);
    } else {
      res.status(404).json({ message: "Azubi not found" });
    }
  } catch (err) {
    console.error("Error deleting Azubi:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchAzubis = async (req, res) => {
  const searchTerm = req.query.q;
  try {
    const azubis = await azubiService.searchAzubis(searchTerm);
    res.status(200).json(azubis);
  } catch (err) {
    console.error("Error searching Azubis:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
