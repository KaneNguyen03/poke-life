import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
// import { CreateIngredientDto } from './dto/create-ingredient.dto';
// import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Prisma } from '@prisma/client';
import { AtStrategy } from 'src/auth/strategies';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('ingredient')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ingredient' })
  @ApiResponse({
    status: 201,
    description: 'The ingredient has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async create(@Body() createIngredientDto: Prisma.IngredientsCreateInput) {
    return this.ingredientService.create(createIngredientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all ingredients' })
  @ApiResponse({ status: 200, description: 'List of ingredients.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAll() {
    return this.ingredientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a ingredient by ID' })
  @ApiResponse({ status: 200, description: 'The ingredient information.' })
  @ApiResponse({ status: 404, description: 'Ingredient not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOne(@Param('id') id: string) {
    return this.ingredientService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ingredient' })
  @ApiResponse({
    status: 200,
    description: 'The ingredient information has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Ingredient not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async update(
    @Param('id') id: string,
    @Body() updateIngredientDto: Prisma.IngredientsUpdateInput,
  ) {
    return this.ingredientService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ingredient' })
  @ApiResponse({
    status: 200,
    description: 'The ingredient has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Ingredient item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async remove(@Param('id') id: string) {
    return this.ingredientService.remove(id);
  }
}
