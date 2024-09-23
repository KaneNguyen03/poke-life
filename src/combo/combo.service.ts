import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ComboService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createComboDto: CreateComboDto) {
    // return await this.databaseService.combos.create({ data: createComboDto });
    try {
      const itemList = createComboDto.itemList;
      if (itemList == undefined || itemList.length == 0) {
        throw new Error('Not found items to create combo');
      }

      let totalCalories = 0;
      let totalPrice = new Decimal(0.0);
      for (const item of itemList) {
        const food = await this.databaseService.food.findUnique({
          where: {
            FoodID: item.foodID,
          },
        });
        if (!food) throw new Error(`Food ID ${item.foodID} not found`);
        // Cộng số lượng calories
        totalCalories += food.Calories;
        // Cộng tổng giá - cần gán lại cho totalPrice
        totalPrice = totalPrice.plus(food.Price.times(item.quantity));
      }

      const comboData: Prisma.CombosCreateInput = {
        Name: createComboDto.name,
        Description: createComboDto.description ?? '',
        Price: totalPrice,
        TotalCalo: totalCalories,
        ImageComboURL: createComboDto.imageURL ?? '',
      };

      const checkCombo = await this.databaseService.combos.create({
        data: comboData,
      });

      if (!checkCombo) throw new Error('Fail to create combo');
      else {
        for (const item of itemList) {
          const comboItemData: Prisma.ComboItemsCreateInput = {
            Combo: {
              connect: { ComboID: checkCombo.ComboID },
            },
            Food: {
              connect: { FoodID: item.foodID },
            },
            Quantity: item.quantity,
          };
          const checkComboItem = await this.databaseService.comboItems.create({
            data: comboItemData,
          });
          if (!checkComboItem) {
            throw new Error('Error when create ComboItem data');
          }
        }

        return 'Create combo successfully';
      }
    } catch (error) {
      console.log('Error when create combo: ', error);
    }
  }

  async findAll() {
    return await this.databaseService.combos.findMany();
  }

  async findOne(id: string) {
    return await this.databaseService.combos.findUnique({
      where: { ComboID: id },
    });
  }

  async update(id: string, updateComboDto: UpdateComboDto) {
    return await this.databaseService.combos.update({
      where: { ComboID: id },
      data: updateComboDto,
    });
  }

  async remove(id: string) {
    return await this.databaseService.combos.delete({ where: { ComboID: id } });
  }
}
