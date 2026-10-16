import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Project } from '../schemas/project.schema.js';
import { CreateProjectDto } from '../dto/create-project.dto.js';
import { UpdateProjectDto } from '../dto/update-project.dto.js';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectModel(Project.name)
    private readonly model: Model<Project>,
  ) { }

  create(ownerId: string, input: CreateProjectDto) {
    return this.model.create({
      ...input,
      ownerId,
    });
  }

  findAllForOwner(ownerId: string) {
    return this.model
      .find({ ownerId })
      .sort({ createdAt: -1 })
      .exec();
  }

  findOneForOwner(id: string, ownerId: string) {
    return this.model
      .findOne({ _id: id, ownerId })
      .exec();
  }

  updateForOwner(
    id: string,
    ownerId: string,
    input: UpdateProjectDto,
  ) {
    return this.model
      .findOneAndUpdate(
        { _id: id, ownerId },
        { $set: input },
        { new: true, runValidators: true },
      )
      .exec();
  }

  deleteForOwner(id: string, ownerId: string) {
    return this.model
      .findOneAndDelete({ _id: id, ownerId })
      .exec();
  }
}
