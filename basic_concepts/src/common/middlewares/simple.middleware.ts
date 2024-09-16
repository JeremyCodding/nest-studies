import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Simple Middleware');
    const authorization = req.headers?.authorization;

    if (authorization) {
      req['user'] = {
        name: 'Jeremy',
        email: 'jeremy@gmail.com',
      };
    }

    res.setHeader('HEADER', 'Of Middleware');
    // return res.status(404).send({
    //   message: 'Not found',
    // });

    next();

    console.log('End of first middleware');

    res.on('finish', () => {
      console.log('Connection Ended');
    });
  }
}
