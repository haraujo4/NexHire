import { Request, Response, NextFunction } from 'express';
import { DIContainer } from '../../infrastructure/container';

export interface ScopedRequest extends Request {
    container: DIContainer;
}

export const scopedContainerMiddleware = (req: any, res: Response, next: NextFunction) => {
    // This creates a NEW instance of DIContainer for this request.
    // 'Scoped' items within this container will be singletons per request.
    req.container = new DIContainer();
    next();
};
