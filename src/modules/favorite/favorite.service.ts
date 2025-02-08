import { Injectable, NotFoundException,  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateFavoriteDto } from '../../domain/dtos/favorite/favorite.dto';
import { UpdateFavoriteDto } from '../../domain/dtos/favorite/favorite.dto';
import { BaseService } from './../../common/bases/base.service';

import { Favorite } from './../../domain/entities/favorite.entity';

import { Repository} from 'typeorm';
import { Patient, Practitioner } from './../../domain/entities';
import { ErrorManager } from './../../common/exceptions/error.manager';
import { PaginationDto } from './../../common/dtos/pagination-common.dto';

@Injectable()
export class FavoriteService extends BaseService<
Favorite, CreateFavoriteDto, UpdateFavoriteDto>{
  constructor(
    @InjectRepository(Favorite) protected repository: Repository<Favorite>,
    // @InjectRepository(User) protected userRepository: Repository<User>,
    // @InjectRepository(Specialist) protected specialistRepository: Repository<Specialist>,
  ){
    super(repository);
  }
  async createFavorite(createFavoriteDto: CreateFavoriteDto):Promise<Favorite>{
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    const { userId, practitionerId: specialistId} = createFavoriteDto
    console.log('Start creating turn...');
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const patient = await queryRunner.manager.findOne(Patient,{
        where:{id: userId},
        relations:[]
      })
      if(!patient){
        throw ErrorManager.createSignatureError('Patient not found, try again');
      }

      const specialist = await queryRunner.manager.findOne(Practitioner, {
        where: { id: specialistId },
        relations: [], // Aquí puedes añadir relaciones si es necesario
      });

      if(!specialist){
        throw ErrorManager.createSignatureError('Sepecialis not found, try again');
      }

      //check if favorite already exist
      const favorite = await queryRunner.manager.findOne(Favorite, {
        where:{
          patient: { id: userId },
          practitioner: { id: specialistId },
        }
      })

      if (favorite) {
        throw ErrorManager.createSignatureError('Favorite already exists');
      }

      const newFavorite = queryRunner.manager.create(Favorite,{
        ...createFavoriteDto,
        patient,
        specialist,
      });
      const savedFavorite = await queryRunner.manager.save(newFavorite);

      await queryRunner.commitTransaction();

      return savedFavorite
      
    } catch (error) {
      console.log('Error occurred:', error);
      await queryRunner.rollbackTransaction();      
      
      if (error instanceof NotFoundException) {
        console.log('NotFoundException: ', error.message);
        throw error;
      }
      console.log('General error: ', error);
      throw ErrorManager.createSignatureError((error as Error).message);
    } finally {
      console.log('Releasing query runner...');
      await queryRunner.release();
    }
  }

  async getAll(paginationDto: PaginationDto): Promise<{ data: Favorite[]; total: number; lastPage: number }> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit; // Calcular el desplazamiento

    const total = await queryRunner.manager.count(Favorite, {
      where: {
        // patient: { id: userId }, // Filtrar por paciente
        // specialist: { id: specialistId }, // Filtrar por especialista
        deletedAt: null,
      },
    });

    const lastPage = Math.ceil(total / limit);


    try {
      const data = await this.repository.find({
        where:{
          deletedAt: null,
        },
        relations:['patient', 'specialist'],
        skip, // Saltar los registros iniciales
        take: limit, // Tomar solo los registros necesarios
      })
      return{
        data, total, lastPage
      }
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getOne(id: string): Promise<Favorite>{
    try {
      const favorite = await this.repository.findOne({
        where:{
          id, deletedAt: null,
        },
        relations:['patient', 'specialist'],
      })
      if (!favorite) {
        throw new NotFoundException(`Favorite with ID ${id} not found`);
      }
      return favorite
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getFavoritesByUser(userId: string, paginationDto: PaginationDto): Promise<{ data: Favorite[]; total: number; lastPage: number }>{

    //paginacion
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit; // Calcular el desplazamiento

    const total = await queryRunner.manager.count(Favorite, {
      where: {
        patient:{
          id: userId
        },
        deletedAt: null,
      },
    });

    const lastPage = Math.ceil(total / limit);


    try {
      const favorites = await this.repository.find({
        where:{
          patient:{
            id: userId
          },
          deletedAt: null
        },
        relations:['specialist'],
        skip, // Saltar los registros iniciales
        take: limit, // Tomar solo los registros necesarios
      });
      if (!favorites.length) {
        throw new NotFoundException(`Favorites not found for user with ${userId}`);
      }
      return {
        total, lastPage,
        data:favorites
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async updateFavorite(id: string, updateFavoriteDto: UpdateFavoriteDto): Promise<Favorite> {
    try {
      const favoriteToUpdate = await this.repository.findOne({
        where:{id, deletedAt: null},
        relations: ['specialist', 'patient'], // Incluir relaciones si es necesario
      });

      if(!favoriteToUpdate){
        throw new NotFoundException(`Favorite with id ${id} was not faound, try again `)
      }
      
      if (updateFavoriteDto.practitionerId) {
        const specialist = await this.repository.manager.findOne(Practitioner, {
          where: { id: updateFavoriteDto.practitionerId },
        });
  
        if (!specialist) {
          throw new NotFoundException(
            `Specialist with id ${updateFavoriteDto.practitionerId} was not found, try again.`
          );
        }
  
        // Asignar el nuevo especialista
        favoriteToUpdate.practitioner = specialist;
      }
  
      // Asignar otros campos del DTO
      Object.assign(favoriteToUpdate, updateFavoriteDto);
  
      
      return await this.repository.save(favoriteToUpdate)
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async removeFavorite (id: string) {
    try {
      const favoriteToRemove = await this.repository.findOne({
        where:{id, deletedAt: null}
      });
  
      if(!favoriteToRemove){
        throw new NotFoundException(`Favorite with id ${id} was not faound, try again `)
      }
  
      const deletedFavorite = await this.repository.softRemove(favoriteToRemove)
  
      return {
        message: 'Favorite remove successfully',
        deletedFavorite,
      }
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async recoverFavorite (id: string) {
    try {
      const favoriteToRecover = await this.repository.findOne({
        where:{id},
        withDeleted: true,
      });
  
      if(!favoriteToRecover || !favoriteToRecover.deletedAt){
        throw new NotFoundException(`Favorite with id ${id} was not faound, try again `)
      }
  
      const favoriteRecovered = await this.repository.recover(favoriteToRecover)
  
      return {
        message: 'Favorite recovered successfully',
        favoriteRecovered
      }
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

}
