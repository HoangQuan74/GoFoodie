import { Injectable } from '@nestjs/common';
import { ProductView } from 'src/database/views/product.view';
import { Repository } from 'typeorm';
import { StoreView } from 'src/database/views/store.view';
import { InjectRepository } from '@nestjs/typeorm';
import { EProductApprovalStatus, EProductStatus } from 'src/common/enums';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(ProductView)
    private readonly productViewRepository: Repository<ProductView>,

    @InjectRepository(StoreView)
    private readonly storeViewRepository: Repository<StoreView>,
  ) {}

  async getSuggestion(keyword: string) {
    keyword = `%${keyword}%`;

    const productQuery = this.productViewRepository
      .createQueryBuilder('product')
      .select('LOWER(product.name)', 'name')
      .where('product.nameUnaccent ILIKE :keyword')
      .andWhere(`product.approvalStatus = '${EProductApprovalStatus.Approved}'`)
      .andWhere(`product.status = '${EProductStatus.Active}'`)
      .setParameter('keyword', keyword)
      .groupBy('LOWER(product.name)')
      .getSql();

    const storeQuery = this.storeViewRepository
      .createQueryBuilder('store')
      .select(`LOWER(store.name)`, 'name')
      .where('store.nameUnaccent ILIKE :keyword')
      .andWhere(`store.approvalStatus = '${EProductApprovalStatus.Approved}'`)
      .andWhere(`store.status = '${EProductStatus.Active}'`)
      .andWhere('store.isPause = false')
      .setParameter('keyword', keyword)
      .groupBy('LOWER(store.name)')
      .getSql();

    const combinedQuery = `SELECT name FROM (${productQuery} UNION ALL ${storeQuery}) AS combined LIMIT 10`;

    const result = await this.productViewRepository.query(combinedQuery, [keyword]);
    return result.map((item) => item.name);
  }
}
