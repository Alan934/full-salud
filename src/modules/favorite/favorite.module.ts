import { forwardRef, Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from '../../domain/entities/favorite.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([Favorite]), 
          forwardRef(()=>AuthModule),],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports:[FavoriteService]
})
export class FavoriteModule {}
