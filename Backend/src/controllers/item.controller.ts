import { Request, Response } from 'express';
import Item from '../models/item.model';

export const getItems = async (req: Request, res: Response): Promise<void> => {
  const items = await Item.find();
  res.json(items);
};

export const getItemById = async (req: Request, res: Response): Promise<void> => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    res.status(404).json({ message: 'Item not found' });
    return;
  }
  res.json(item);
};

export const createItem = async (req: Request, res: Response) => {
  try {
    const { description, contentSummary, storageDetails, storageLocation } = req.body;

    const item = new Item({
      description,
      contentSummary,
      storageDetails,
      storageLocation,
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};



export const updateItem = async (req: Request, res: Response): Promise<void> => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updatedItem) {
    res.status(404).json({ message: 'Item not found' });
    return;
  }
  res.json(updatedItem);
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  const deletedItem = await Item.findByIdAndDelete(req.params.id);
  if (!deletedItem) {
    res.status(404).json({ message: 'Item not found' });
    return;
  }
  res.json({ message: 'Item deleted' });
};
