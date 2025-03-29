import { EStoreApprovalStatus, EStoreStatus, EStoreAddressType } from 'src/common/enums';
import { ViewEntity, ViewColumn, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';

@ViewEntity({
  expression: `
    SELECT 
      s.id,
      s.store_code,
      s.name,
      LOWER(UNACCENT(CONCAT_WS(' - ', s.name, NULLIF(s.special_dish, ''), NULLIF(s.street_name, '')))) AS name_unaccent,
      s.special_dish,
      s.street_name,
      s.store_avatar_id,
      s.store_cover_id,
      s.status,
      s.approval_status,
      s.is_pause,
      s.created_at,
      s.updated_at,
      sa.lat AS receive_lat,
      sa.lng AS receive_lng,
      COUNT(DISTINCT sl.client_id) AS like_count,
      COUNT(DISTINCT crs.id) AS review_count,
      COALESCE(ROUND(AVG(crs.rating), 1), 0) AS avg_rating
    FROM stores s
    LEFT JOIN store_likes sl ON s.id = sl.store_id
    LEFT JOIN client_review_stores crs ON s.id = crs.store_id
    LEFT JOIN store_address sa ON s.id = sa.store_id AND sa.type = '${EStoreAddressType.Receive}'
    WHERE s.deleted_at IS NULL
    GROUP BY s.id, sa.id
  `,
})
export class StoreView {
  @PrimaryColumn()
  id: number;

  @ViewColumn()
  storeCode: string;

  @ViewColumn()
  name: string;

  @ViewColumn({ name: 'name_unaccent' })
  nameUnaccent: string;

  @ViewColumn({ name: 'special_dish' })
  specialDish: string;

  @ViewColumn({ name: 'street_name' })
  streetName: string;

  @ViewColumn({ name: 'store_avatar_id' })
  storeAvatarId: number;

  @ViewColumn({ name: 'store_cover_id' })
  storeCoverId: number;

  @ViewColumn({ name: 'receive_lat' })
  receiveLat: number;

  @ViewColumn({ name: 'receive_lng' })
  receiveLng: number;

  @ViewColumn()
  status: EStoreStatus;

  @ViewColumn({ name: 'is_pause' })
  isPause: boolean;

  @ViewColumn({ name: 'approval_status' })
  approvalStatus: EStoreApprovalStatus;

  @ViewColumn({ name: 'created_at' })
  createdAt: Date;

  @ViewColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ViewColumn({ name: 'like_count' })
  likeCount: number;

  @ViewColumn({ name: 'review_count' })
  reviewCount: number;

  @ViewColumn({ name: 'avg_rating' })
  avgRating: number;

  @OneToMany(() => ProductEntity, (product) => product.store)
  products: ProductEntity[];
}
