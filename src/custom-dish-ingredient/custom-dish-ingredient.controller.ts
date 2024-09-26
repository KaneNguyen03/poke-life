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
import { CustomDishIngredientService } from './custom-dish-ingredient.service';
// import { CreateCustomDishIngredientDto } from './dto/create-custom-dish-ingredient.dto';
// import { UpdateCustomDishIngredientDto } from './dto/update-custom-dish-ingredient.dto';

import { Prisma } from '@prisma/client';
import { AtStrategy } from 'src/auth/strategies';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard'; // Đảm bảo đường dẫn đúng
import { Roles } from 'src/common/decorators/roles.decorator'; // Đảm bảo đường dẫn đúng
import { UserRole } from 'src/auth/types/user-role.enum';

@ApiTags('custom-dish-ingredient')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('custom-dish-ingredient')
export class CustomDishIngredientController {
  constructor(
    private readonly customDishIngredientService: CustomDishIngredientService,
  ) {}

  @Post()
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new custom dish ingredient' })
  @ApiResponse({
    status: 201,
    description: 'The custom dish ingredient has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async create(
    @Body()
    createCustomDishIngredientDto: Prisma.CustomDishIngredientsCreateInput,
  ) {
    return this.customDishIngredientService.create(
      createCustomDishIngredientDto,
    );
  }

  @Get()
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve all custom dish ingredients' })
  @ApiResponse({ status: 200, description: 'List of custom dish ingredients.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAll() {
    return this.customDishIngredientService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve a custom dish ingredient by ID' })
  @ApiResponse({
    status: 200,
    description: 'The custom dish ingredient information.',
  })
  @ApiResponse({
    status: 404,
    description: 'Custom dish ingredient not found.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOne(@Param('id') id: string) {
    return this.customDishIngredientService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.Admin) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a custom dish ingredient' })
  @ApiResponse({
    status: 200,
    description:
      'The custom dish ingredient information has been successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'Custom dish ingredient not found.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async update(
    @Param('id') id: string,
    @Body()
    updateCustomDishIngredientDto: Prisma.CustomDishIngredientsUpdateInput,
  ) {
    return this.customDishIngredientService.update(
      id,
      updateCustomDishIngredientDto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.Admin) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a custom dish ingredient' })
  @ApiResponse({
    status: 200,
    description: 'The custom dish ingredient has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Custom dish ingredient item not found.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async remove(@Param('id') id: string) {
    return this.customDishIngredientService.remove(id);
  }
}
