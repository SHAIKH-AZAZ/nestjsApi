import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { ProjectsRepository } from './repositories/projects.repository.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly repository: ProjectsRepository,
  ) { }

  create(ownerId: string, input: CreateProjectDto) {
    return this.repository.create(ownerId, input);
  }

  findAll(ownerId: string) {
    return this.repository.findAllForOwner(ownerId);
  }

  async findOne(id: string, ownerId: string) {
    this.validateId(id);

    const project = await this.repository.findOneForOwner(
      id,
      ownerId,
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(
    id: string,
    ownerId: string,
    input: UpdateProjectDto,
  ) {
    this.validateId(id);

    const project = await this.repository.updateForOwner(
      id,
      ownerId,
      input,
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async remove(id: string, ownerId: string) {
    this.validateId(id);

    const project = await this.repository.deleteForOwner(
      id,
      ownerId,
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }
  }

  private validateId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid project ID');
    }
  }
}
