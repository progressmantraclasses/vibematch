import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsGateway } from './events.gateway';
import {
  MatchConnection,
  MatchConnectionSchema,
} from '../schemas/match-connection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MatchConnection.name, schema: MatchConnectionSchema },
    ]),
  ],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class GatewayModule {}
