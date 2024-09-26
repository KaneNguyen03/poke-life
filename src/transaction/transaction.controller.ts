import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';

// import { Prisma } from '@prisma/client'
import { AtStrategy } from 'src/auth/strategies';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { RolesGuard } from 'src/common/guards/roles.guard'; // Đảm bảo đường dẫn đúng
import { Roles } from 'src/common/decorators/roles.decorator'; // Đảm bảo đường dẫn đúng
import { UserRole } from 'src/auth/types/user-role.enum';

@ApiTags('transaction')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @UsePipes(new ValidationPipe({ transform: true })) // ValidationPipe để kích hoạt validator
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get('/statistics')
  @Roles(UserRole.Admin) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get statistics of admin dashboard' })
  @ApiResponse({ status: 200, description: 'Statistics of admin dashboard.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getStatistics() {
    return this.transactionService.getStatistics();
  }

  @Get()
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve all transactions' })
  @ApiResponse({ status: 200, description: 'List of transactions.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAll(
    @Query('pageIndex') pageIndex?: string, // Optional parameter as string
    @Query('pageSize') pageSize?: string, // Optional parameter as string
    @Query('keyword') keyword?: string, // Optional parameter
  ) {
    const parsedPageIndex = parseInt(pageIndex || '', 10);
    const parsedPageSize = parseInt(pageSize || '', 10);

    // Set default values if parsing results in NaN
    const finalPageIndex = isNaN(parsedPageIndex) ? 1 : parsedPageIndex;
    const finalPageSize = isNaN(parsedPageSize) ? 10 : parsedPageSize;
    const finalKeyword = keyword ?? '';
    return this.transactionService.findAll(
      finalPageIndex,
      finalPageSize,
      finalKeyword,
    );
  }

  @Get(':id')
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve a transaction by ID' })
  @ApiResponse({ status: 200, description: 'The transaction information.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.Admin) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a transaction information' })
  @ApiResponse({
    status: 200,
    description: 'The transaction information has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiResponse({
    status: 200,
    description: 'The transaction has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Transaction item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async remove(@Param('id') id: string) {
    return this.transactionService.remove(id);
  }
}
