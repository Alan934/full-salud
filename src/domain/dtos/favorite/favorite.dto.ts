import { ApiProperty, PartialType } from "@nestjs/swagger";
//import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString  } from "class-validator";
//import { ShortBaseDto } from "src/common/dtos";

export class CreateFavoriteDto {

    
    @IsBoolean()
    @ApiProperty({example: true})
    @IsOptional()
    enabled: boolean;
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '20a05b0e-d872-4fe5-bf9f-4b6b010b443d' })
    userId: string 

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '20a05b0e-d872-4fe5-bf9f-4b6b010b443d' })
    practitionerId: string 

}

export class UpdateFavoriteDto extends PartialType(
    CreateFavoriteDto){
}