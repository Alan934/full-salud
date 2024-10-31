import { S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from '../../common/bases/images-base/aws/s3/s3.service';
import { DisabilityCardImage } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class DisabilityCardImagesService extends S3Service<DisabilityCardImage> {
  constructor(
    @InjectRepository(DisabilityCardImage)
    protected repository: Repository<DisabilityCardImage>,
    @Inject('S3_CLIENT') protected readonly s3Client: S3Client
  ) {
    super(s3Client, repository, 'DisabilityCard');
  }
}
