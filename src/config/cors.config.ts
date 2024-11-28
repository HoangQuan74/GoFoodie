import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig: CorsOptions = {
  origin: ['http://localhost:8889', 'https://admin-dev.oneship.com.vn'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
