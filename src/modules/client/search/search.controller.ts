import { normalizeText } from './../../../utils/bcrypt';
import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('suggestion')
  async getSuggestion(@Query('keyword') keyword: string) {
    const normalizedKeyword = normalizeText(keyword);
    return this.searchService.getSuggestion(normalizedKeyword);
  }
}
