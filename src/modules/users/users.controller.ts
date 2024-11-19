import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import { FindUsersQuery } from './dto/find-users-query.dto';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  async findAll(@Query() query: FindUsersQuery) {
    const { limit, page, ...filter } = query;

    const whereClause = { ...filter };
    const options = { where: whereClause, take: limit, skip: (page - 1) * limit };
    const itemsPromise = this.usersService.findAll(options);
    const totalPromise = this.usersService.count({ where: whereClause });

    const [items, total] = await Promise.all([itemsPromise, totalPromise]);
    return { items, total };
  }
}
