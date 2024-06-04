import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export class MongoMiddleware {

  public static isMongoId( req: Request, res: Response, next: NextFunction ) {
  
    const { id } = req.params;

    const isMongoIdValid = mongoose.isValidObjectId( id );

    if ( !isMongoIdValid ) {
      return res.status(400).json({ error: 'It is not a valid mongo id'});
    }

    next();

  }

}