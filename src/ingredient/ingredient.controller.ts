import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { IngredientService } from './ingredient.service'
// import { Prisma } from '@prisma/client';
import { AtStrategy } from 'src/auth/strategies'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CreateIngredientDto } from './dto/create-ingredient.dto'
import { UpdateIngredientDto } from './dto/update-ingredient.dto'
import { RolesGuard } from 'src/common/guards/roles.guard' // Đảm bảo đường dẫn đúng
import { Roles } from 'src/common/decorators/roles.decorator' // Đảm bảo đường dẫn đúng
import { UserRole } from 'src/auth/types/user-role.enum'
import { Public } from 'src/common/decorators'

@ApiTags('ingredient')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) { }

  @Post()
  @Roles(UserRole.Admin) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new ingredient' })
  @ApiResponse({
    status: 201,
    description: 'The ingredient has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientService.create(createIngredientDto)
  }

  @Public()
  @Get()
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve all ingredients' })
  @ApiResponse({ status: 200, description: 'List of ingredients.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAll() {

    return this.ingredientService.findAll()
  }


  @Public()
  @Get(':foodID')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve ingredients and quantities for a specific food item' })
  @ApiResponse({ status: 200, description: 'List of ingredients with quantities.' })
  @ApiResponse({ status: 404, description: 'Food not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findIngredientsByFoodID(@Param('foodID') foodID: string) {
      return this.ingredientService.findIngredientsByFoodID(foodID);
  }

  @Get(':id')
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve a ingredient by ID' })
  @ApiResponse({ status: 200, description: 'The ingredient information.' })
  @ApiResponse({ status: 404, description: 'Ingredient not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOne(@Param('id') id: string) {
    return this.ingredientService.findOne(id)
  }

  @Patch(':id')
  @Roles(UserRole.Admin) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a ingredient' })
  @ApiResponse({
    status: 200,
    description: 'The ingredient information has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Ingredient not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientService.update(id, updateIngredientDto)
  }

  @Delete(':id')
  @Roles(UserRole.Admin) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a ingredient' })
  @ApiResponse({
    status: 200,
    description: 'The ingredient has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Ingredient item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async remove(@Param('id') id: string) {
    return this.ingredientService.remove(id)
  }
}
