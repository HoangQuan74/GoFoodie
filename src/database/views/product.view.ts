import { EStoreApprovalStatus, EStoreStatus } from 'src/common/enums';
import { ViewEntity, ViewColumn, OneToMany } from 'typeorm';
import { ProductOptionGroupEntity } from '../entities/product-option-group.entity';

@ViewEntity({
  expression: `
    SELECT 
      p.id,
      p.name,
      LOWER(unaccent(p.name)) AS name_unaccent,
      p.code,
      p.price,
      p.status,
      p.approval_status,
      p.store_id,
      p.product_category_id,
      p.created_at,
      p.updated_at,
      p.image_id,
      p.description,  
      COUNT(DISTINCT pl.client_id) AS liked,
      COUNT(DISTINCT oi.id) AS sold
    FROM products p
    LEFT JOIN product_likes pl ON p.id = pl.product_id
    LEFT JOIN order_items oi ON p.id = oi.product_id
    WHERE p.deleted_at IS NULL
    GROUP BY p.id
  `,
})
export class ProductView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  name: string;

  @ViewColumn({ name: 'name_unaccent' })
  nameUnaccent: string;

  @ViewColumn()
  code: string;

  @ViewColumn()
  price: number;

  @ViewColumn()
  status: EStoreStatus;

  @ViewColumn({ name: 'approval_status' })
  approvalStatus: EStoreApprovalStatus;

  @ViewColumn({ name: 'store_id' })
  storeId: number;

  @ViewColumn({ name: 'description' })
  description: string;

  @ViewColumn({ name: 'product_category_id' })
  productCategoryId: number;

  @ViewColumn({ name: 'created_at' })
  createdAt: Date;

  @ViewColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ViewColumn({ name: 'image_id' })
  imageId: number;

  @ViewColumn()
  sold: number;

  @ViewColumn()
  liked: number;

  @OneToMany(() => ProductOptionGroupEntity, (productOptionGroup) => productOptionGroup.product)
  productOptionGroups: ProductOptionGroupEntity[];
}
