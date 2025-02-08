import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from '../../domain/dtos/favorite/favorite.dto';
import { UpdateFavoriteDto } from '../../domain/dtos/favorite/favorite.dto';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { SerializerFavoriteDto } from '../../domain/dtos/favorite/favorite-serializer.dto';
import { Favorite } from '../../domain/entities/favorite.entity';
import { toDto } from '../../common/util/transform-dto.util';
import { PaginationDto } from './../../common/dtos/pagination-common.dto';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoriteController  extends ControllerFactory<
    Favorite, CreateFavoriteDto, UpdateFavoriteDto, SerializerFavoriteDto>(
    Favorite,
    CreateFavoriteDto,
    UpdateFavoriteDto,
    SerializerFavoriteDto){
  constructor(private readonly favoriteService: FavoriteService) {
    super()
  }

  @Post()
  @ApiOperation({description: 'Crear un favorito'})
  @ApiCreatedResponse({
    description:'Favorito creado exitosamente',
    type: SerializerFavoriteDto
  })
  @ApiResponse({status: 400, description: 'Bad Request'})
  async createFavorite(@Body() createFavoriteDto: CreateFavoriteDto): Promise<SerializerFavoriteDto> {
    const favorite =  await this.favoriteService.createFavorite(createFavoriteDto);
    return toDto(SerializerFavoriteDto, favorite)
  }

  @Get()
  @ApiOperation({description: 'Obtener todos los favoritos'})
  @ApiResponse({status: 200, description: 'Lista de favoritos', type: [SerializerFavoriteDto]})
  async getAllFavorites(@Query() paginationDto: PaginationDto):Promise<{
    data: SerializerFavoriteDto[];
    total: number;
    lastPage: number;
  }> {
    const {data, total, lastPage} = await this.favoriteService.getAll(paginationDto);
    const serializedData = data.map((favorite) => toDto(SerializerFavoriteDto, favorite));
    return {
      data: serializedData,
      total,
      lastPage,
    };
  }

  @Get(':id')
  @ApiOperation({description: 'Obtener un favorito por id'})
  @ApiParam({name:' favorite', description: 'UUID de favorito', type: String})
  @ApiResponse({status: 200, description: 'Favorito encontrado', type: SerializerFavoriteDto})
  @ApiResponse({status: 400, description:'Favorito no encontrado'})
  async getOneById(
    @Param('id', new ParseUUIDPipe({version: '4'})) id: string
  ): Promise<SerializerFavoriteDto>{
    const favorite = await this.favoriteService.getOne(id);
    return toDto(SerializerFavoriteDto, favorite)
  }

  @Get('getByPatient/:patientId')
  @ApiOperation({description: 'Obtener un favorito por id de usuario'})
  @ApiParam({name:' patientId', description: 'UUID de usuario', type: String})
  @ApiResponse({status: 200, description: 'Favoritos encontrado', type: [SerializerFavoriteDto]})
  @ApiResponse({status: 400, description:'Favoritos no encontrado'})
  async getFavoritesByUser(
    @Query() paginationDto: PaginationDto,
    @Param('patientId', new ParseUUIDPipe({version: '4'})) patientId: string
  ): Promise<{
    data: SerializerFavoriteDto[];
    total: number;
    lastPage: number;
  }>{
    const {data, total, lastPage} = await this.favoriteService.getFavoritesByUser(patientId, paginationDto);
    const serializedData = data.map((favorite) => toDto(SerializerFavoriteDto, favorite));
    return {
      data: serializedData,
      total,
      lastPage,
    };
  }

  @Patch(':id')
  @ApiOperation({ description: 'Actualizar un favorito' })
  @ApiParam({ name: 'id', description: 'UUID de favorito', type: String })
  @ApiBody({ type: UpdateFavoriteDto })
  @ApiResponse({ status: 200, description: 'Favorito actualizado correctamente', type: SerializerFavoriteDto })
  @ApiResponse({ status: 404, description: 'Favorito no encontrado' })
  async updateFavorito(
    @Param('id') id: string, 
    @Body() updateFavoriteDto: UpdateFavoriteDto)
    :Promise<SerializerFavoriteDto> {
    const favorite = await this.favoriteService.updateFavorite(id, updateFavoriteDto);
    return toDto(SerializerFavoriteDto, favorite)
  }

  @Patch('/remove/:id')
  @ApiOperation({ description: 'Eliminar (soft delete) de favorito' })
  @ApiParam({ name: 'id', description: 'UUID del favorito', type: String })
  @ApiResponse({ status: 200, description: 'Favorito eliminado correctamente', schema: { example: { message: 'Favorito deleted successfully', deletedFavorito: { /* ejemplo del turno */ } } } })
  @ApiResponse({ status: 404, description: 'Favorito no encontrado' })
  async removeFavorito(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ message: string; deletedFavorite: Favorite }> {
    return this.favoriteService.removeFavorite(id);
  }

  @Patch('/recover/:id')
  @ApiOperation({ description: 'Recuperar (soft delete) de favorito' })
  @ApiParam({ name: 'id', description: 'UUID del favorito', type: String })
  @ApiResponse({ status: 200, description: 'Favorito recuperado correctamente', schema: { example: { message: 'Favorito deleted successfully', deletedFavorito: { /* ejemplo del turno */ } } } })
  @ApiResponse({ status: 404, description: 'Favorito no encontrado' })
  async recoverFavorito(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ message: string; favoriteRecovered: Favorite }> {
    return this.favoriteService.recoverFavorite(id);
  }
}
