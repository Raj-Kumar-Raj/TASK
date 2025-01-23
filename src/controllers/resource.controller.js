import Resource from "../models/resource.model.js";

export const createResource = async (req, res) => {
  try {
    const resource = await Resource.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate("createdBy", "email");
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate(
      "createdBy",
      "email"
    );
    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ message: "Resource not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedResource);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteResource = async (req, res) => {
  try {
    // Validate the ID
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid resource ID" });
    }

    // Find the resource by ID
    const resource = await Resource.findByIdAndDelete(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(200).json({ message: "Resource removed successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
