import { DatabaseService } from 'src/database/database.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { CreateFoodDto, CreateCustomFoodDto } from './dto/create-food.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class FoodService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createFoodDto: CreateFoodDto) {
    // return await this.databaseService.food.create({ data: createFoodDto });
    try {
      const foodData: Prisma.FoodCreateInput = {
        Name: createFoodDto.name,
        Description: createFoodDto.description ?? 'No description',
        Price: createFoodDto.price,
        Calories: createFoodDto.calories,
        Image: createFoodDto.image ?? '',
      };

      const checkFood = await this.databaseService.food.create({
        data: foodData,
      });

      if (!checkFood) throw new Error('Fail to create food');
      else return 'Create food successfully';
    } catch (error) {
      console.log('Error when create a food: ', error);
    }
  }

  async createCustomDish(createCustomFoodDto: CreateCustomFoodDto) {
    try {
      const ingredientList = createCustomFoodDto.ingredientList;
      if (ingredientList == undefined || ingredientList.length == 0) {
        throw new Error('Not found ingredients to create food');
      }

      let totalCalories = 0;
      let totalPrice = new Decimal(0.0);

      for (const item of ingredientList) {
        const ingre = await this.databaseService.ingredients.findUnique({
          where: {
            IngredientID: item.ingredientID,
          },
        });
        if (!ingre)
          throw new Error(`Ingredient ID ${item.ingredientID} not found`);
        // Cộng số lượng calories
        totalCalories += ingre.Calories;
        // Cộng tổng giá - cần gán lại cho totalPrice
        totalPrice = totalPrice.plus(ingre.Price.times(item.quantity));
      }

      const foodData: Prisma.FoodCreateInput = {
        Name: createCustomFoodDto.name,
        Description: createCustomFoodDto.description ?? 'No description',
        Price: totalPrice,
        Calories: totalCalories,
        Image: createCustomFoodDto.image ?? '',
      };

      const checkFood = await this.databaseService.food.create({
        data: foodData,
      });

      if (!checkFood) throw new Error('Fail to create food');
      else {
        for (const item of ingredientList) {
          const customDishIngredientData: Prisma.CustomDishIngredientsCreateInput =
            {
              Food: {
                connect: { FoodID: checkFood.FoodID },
              },
              Ingredient: {
                connect: { IngredientID: item.ingredientID },
              },
              Quantity: item.quantity,
            };
          const checkCustomFood =
            await this.databaseService.customDishIngredients.create({
              data: customDishIngredientData,
            });
          if (!checkCustomFood)
            throw new Error('Error when create CustomDishIngredients data');
        }

        return 'Create custom dish successfully';
      }
    } catch (error) {
      console.log('Error when create a food: ', error);
    }
  }

  async findAll(pageIndex: number, pageSize: number, keyword: string = '') {
    try {
      const skip = (pageIndex - 1) * pageSize;
      const take = pageSize;

      // Điều kiện tìm kiếm
      const where: Prisma.FoodWhereInput = {
        IsDeleted: false, // Lọc những đơn hàng không bị xóa
        ...(keyword && {
          OR: [
            { FoodID: { contains: keyword, mode: 'insensitive' } },
            { Name: { contains: keyword, mode: 'insensitive' } },
            // Thêm các trường khác nếu cần
          ],
        }),
      };

      const foods = await this.databaseService.food.findMany({
        skip,
        take,
        where,
      });
      if (foods.length == 0) throw new NotFoundException('Not found any food');
      else return foods;
    } catch (error) {
      console.log('Error when get all food: ', error);
    }
  }

  async findAllForCustomer(
    pageIndex: number,
    pageSize: number,
    keyword: string = '',
  ) {
    try {
      const skip = (pageIndex - 1) * pageSize;
      const take = pageSize;

      // Điều kiện tìm kiếm cơ bản
      const where: Prisma.FoodWhereInput = {
        IsDeleted: false, // Lọc những món ăn không bị xóa
        ...(keyword && {
          OR: [
            { FoodID: { contains: keyword, mode: 'insensitive' } },
            { Name: { contains: keyword, mode: 'insensitive' } },
            // Thêm các trường khác nếu cần
          ],
        }),
      };

      // Lấy danh sách foods theo trang và điều kiện tìm kiếm
      const foods = await this.databaseService.food.findMany({
        skip,
        take,
        where,
      });

      // Nếu không có món ăn nào được tìm thấy
      if (foods.length === 0) {
        throw new NotFoundException('Not found any food');
      }

      // Mảng kết quả
      const result: typeof foods = [];

      // Duyệt qua từng món ăn trong foods
      for (const food of foods) {
        // Kiểm tra xem FoodID của món ăn có nằm trong customDishIngredients hay không
        const customDishIngredient =
          await this.databaseService.customDishIngredients.findFirst({
            where: {
              FoodID: food.FoodID, // Tìm trong bảng customDishIngredients dựa trên FoodID
            },
          });

        // Nếu không tìm thấy bản ghi nào trong customDishIngredients, thêm food vào kết quả
        if (!customDishIngredient) {
          result.push(food);
        }
      }

      // Trả về mảng kết quả sau khi lọc
      return result;
    } catch (error) {
      console.log('Error when get all food: ', error);
      throw new Error('Error when get all food');
    }
  }

  async findAllCustomFoodOfCustomer(currentUserId: string) {
    try {
      // Khởi tạo mảng kết quả
      const result: any[] = [];

      // Tìm các đơn hàng của khách hàng
      const orderListOfCustomer = await this.databaseService.orders.findMany({
        where: {
          CustomerID: currentUserId,
        },
      });

      // Nếu không có đơn hàng nào thì trả lỗi
      if (orderListOfCustomer.length == 0) {
        throw new NotFoundException("User doesn't have any order");
      }

      // Lặp qua từng đơn hàng của khách hàng
      for (const order of orderListOfCustomer) {
        // Tìm các chi tiết đơn hàng của từng đơn hàng
        const orderDetails = await this.databaseService.orderDetails.findMany({
          where: {
            OrderID: order.OrderID,
          },
        });

        // Nếu đơn hàng không có chi tiết, trả lỗi
        if (orderDetails.length == 0) {
          throw new NotFoundException(
            `Order ID ${order.OrderID} has no details`,
          );
        }

        // Lặp qua từng chi tiết đơn hàng
        for (const item of orderDetails) {
          // Tìm món ăn dựa trên FoodID
          const food = await this.databaseService.food.findUnique({
            where: {
              FoodID: item.FoodID,
            },
          });

          // Nếu không tìm thấy món ăn, trả lỗi
          if (!food) {
            throw new NotFoundException(
              `Not found food of order detail ID ${item.OrderDetailID}`,
            );
          }

          // Kiểm tra xem món ăn có trong bảng customDishIngredients không
          const check =
            await this.databaseService.customDishIngredients.findFirst({
              where: {
                FoodID: food.FoodID,
              },
            });

          // Nếu món ăn có trong customDishIngredients, thêm vào kết quả
          if (check) {
            result.push(food);
          }
        }
      }
      // Trả về mảng kết quả sau khi đã lặp qua tất cả đơn hàng và chi tiết
      return result.length == 0 ? result : 'Your custom dish has not found';
    } catch (error) {
      console.log('Error when get custom food of customer: ', error);
      throw new Error('Error when get custom food of customer');
    }
  }

  async findOne(id: string) {
    return await this.databaseService.food.findUnique({
      where: { FoodID: id },
    });
  }

  async update(id: string, updateFoodDto: Prisma.FoodUpdateInput) {
    return await this.databaseService.food.update({
      where: { FoodID: id },
      data: updateFoodDto,
    });
  }

  async remove(id: string) {
    return await this.databaseService.food.update({
      where: { FoodID: id },
      data: { IsDeleted: true },
    });
  }
}
