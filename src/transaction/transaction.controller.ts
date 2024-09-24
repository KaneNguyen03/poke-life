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

@ApiTags('transaction')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
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
  @ApiOperation({ summary: 'Get statistics of admin dashboard' })
  @ApiResponse({ status: 200, description: 'Statistics of admin dashboard.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getStatistics() {
    return this.transactionService.getStatistics();
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all transactions' })
  @ApiResponse({ status: 200, description: 'List of transactions.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAll(
    @Query('pageIndex') pageIndex: number = 1, // Mặc định là trang 1
    @Query('pageSize') pageSize: number = 10, // Mặc định là 10 mục trên mỗi trang
    @Query('keyword') keyword?: string, // Từ khóa tìm kiếm tùy chọn
  ) {
    return this.transactionService.findAll(pageIndex, pageSize, keyword);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a transaction by ID' })
  @ApiResponse({ status: 200, description: 'The transaction information.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Patch(':id')
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
