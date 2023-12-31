import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import AuthController from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

import { CategoryModule } from './category/category.module';
import { BibliografiModule } from './bibliografi/bibliografi.module';
import { VisitorModule } from './visitor/visitor.module';
import { ListcontentModule } from './listcontent/listcontent.module';
import { ContentModule } from './content/content.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UsersModule,
    AuthModule,
    CategoryModule,
    BibliografiModule,
    VisitorModule,
    ListcontentModule,
    ContentModule,
    SearchModule,
  ],
  controllers: [AppController, AuthController],
  providers: [],
})
export class AppModule {}
