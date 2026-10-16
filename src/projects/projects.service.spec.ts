import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { ProjectsService } from './projects.service.js';
import { ProjectsRepository } from './repositories/projects.repository.js';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository: jest.Mocked<ProjectsRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAllForOwner: jest.fn(),
      findOneForOwner: jest.fn(),
      updateForOwner: jest.fn(),
      deleteForOwner: jest.fn(),
    } as unknown as jest.Mocked<ProjectsRepository>;

    service = new ProjectsService(repository);
  });

  it('creates a project for the supplied owner', async () => {
    const ownerId = new Types.ObjectId().toString();
    const input = { name: 'Tower A' };
    const expected = { id: 'project-1', ...input };

    repository.create.mockResolvedValue(expected as never);

    await expect(
      service.create(ownerId, input),
    ).resolves.toEqual(expected);

    expect(repository.create).toHaveBeenCalledWith(
      ownerId,
      input,
    );
  });

  it('rejects malformed project IDs', async () => {
    await expect(
      service.findOne('not-an-object-id', 'owner-1'),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(repository.findOneForOwner).not.toHaveBeenCalled();
  });

  it('returns 404 for a project not owned by the caller', async () => {
    const id = new Types.ObjectId().toString();

    repository.findOneForOwner.mockResolvedValue(null);

    await expect(
      service.findOne(id, 'another-owner'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
