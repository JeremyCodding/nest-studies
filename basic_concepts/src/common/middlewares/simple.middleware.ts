import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers?.authorization;

    if (authorization) {
      req['user'] = {
        name: 'Jeremy',
        email: 'jeremy@gmail.com',
        role: 'admin',
      };
    }

    res.setHeader('HEADER', 'Of Middleware');
    // return res.status(404).send({
    //   message: 'Not found',
    // });

    next();

    res.on('finish', () => {});
  }
}
