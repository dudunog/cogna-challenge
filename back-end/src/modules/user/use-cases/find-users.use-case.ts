import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { QueryUserDto } from 'src/modules/user/dto/query-user.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class FindUsersUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(query: QueryUserDto) {
    const where: Prisma.UserWhereInput = {};
    const orderBy: Prisma.UserOrderByWithRelationInput = {};

    if (query.email) {
      where.email = {
        contains: query.email,
      };
    }

    if (query.orderBy) {
      orderBy.createdAt = query.orderBy;
    } else {
      orderBy.createdAt = 'desc';
    }

    const [users, total] = await Promise.all([
      this.userService.findMany({
        skip: query.skip,
        take: query.take,
        where,
        orderBy,
      }),
      this.userService.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        skip: query.skip ?? 0,
        take: query.take ?? users.length,
      },
    };
  }
}
