import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [UsersModule, PostsModule, CommentsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/SimpleBlog'),
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
