import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { ResponseWebError } from 'src/model/response.web';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let error: ResponseWebError;
    console.log(exception.code);
    switch (exception.code) {
      case 11000:
        const pattern = /dup key: { (\w+):/;
        const match = pattern.exec(exception.message);
        error = {
          status: 'failed',
          statusCode: 400,
          message: `${match[1]} has been used, please try other ${match[1]}`,
        };
    }

    response.status(error.statusCode).json(error);
  }
}
