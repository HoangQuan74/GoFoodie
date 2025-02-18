import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT 
      d.id,
      d.full_name,
      d.avatar,
      COALESCE(ROUND(AVG(crd.rating), 1), 0) AS avg_rating
    FROM drivers d
    LEFT JOIN client_review_drivers crd ON d.id = crd.driver_id
    WHERE d.deleted_at IS NULL
    GROUP BY d.id
  `,
})
export class DriverView {
  @ViewColumn()
  id: number;

  @ViewColumn({ name: 'full_name' })
  fullName: string;

  @ViewColumn()
  avatar: string;

  @ViewColumn({ name: 'avg_rating' })
  avgRating: number;
}
