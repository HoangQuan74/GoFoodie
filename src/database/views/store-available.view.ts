import { EStoreApprovalStatus, EStoreStatus, EStoreAddressType } from 'src/common/enums';
import { ViewEntity, ViewColumn, OneToMany, Index } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';

@ViewEntity({
  name: 'store_available_view',
  expression: `
    SELECT 
      s.id,
      s.store_code,
      s.name,
      s.special_dish,
      s.street_name,
      s.store_avatar_id,
      s.store_cover_id,
      s.status,
      s.approval_status,
      s.created_at,
      s.updated_at,
      sa.lat AS receive_lat,
      sa.lng AS receive_lng,
      COUNT(DISTINCT sl.client_id) AS like_count,
      COUNT(DISTINCT crs.id) AS review_count,
      COALESCE(ROUND(AVG(crs.rating), 1), 0) AS avg_rating
    FROM stores s
    INNER JOIN store_working_times swt ON (
      s.id = swt.store_id
      AND swt.day_of_week = EXTRACT(DOW FROM CURRENT_DATE)
      AND swt.open_time <= EXTRACT(HOUR FROM CURRENT_TIME) * 60 + EXTRACT(MINUTE FROM CURRENT_TIME)
      AND swt.close_time >= EXTRACT(HOUR FROM CURRENT_TIME) * 60 + EXTRACT(MINUTE FROM CURRENT_TIME)
      AND swt.is_open = TRUE
    )
    LEFT JOIN store_special_working_time sswt ON (
      s.id = sswt.store_id
      AND sswt.date = CURRENT_DATE
      AND sswt.start_time <= EXTRACT(HOUR FROM CURRENT_TIME) * 60 + EXTRACT(MINUTE FROM CURRENT_TIME)
      AND sswt.end_time >= EXTRACT(HOUR FROM CURRENT_TIME) * 60 + EXTRACT(MINUTE FROM CURRENT_TIME)
      AND sswt.is_open = FALSE
    )
    LEFT JOIN store_likes sl ON s.id = sl.store_id
    LEFT JOIN client_review_stores crs ON s.id = crs.store_id
    LEFT JOIN store_address sa ON s.id = sa.store_id AND sa.type = '${EStoreAddressType.Receive}'
    WHERE s.deleted_at IS NULL
      AND s.status = '${EStoreStatus.Active}'
      AND s.approval_status = '${EStoreApprovalStatus.Approved}'
      AND s.is_pause = FALSE
      AND sswt.id IS NULL
    GROUP BY s.id, sa.id
  `,
})
export class StoreAvailableView {
  @Index()
  @ViewColumn()
  id: number;

  @ViewColumn()
  storeCode: string;

  @ViewColumn()
  name: string;

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
