import { Logger } from './log';
import { Context, Callback, ALBResult, CloudFrontRequestResult } from 'aws-lambda';
import * as pino from 'pino';

export interface HttpStatus {
    statusCode: string;
    statusDescription: string;
}
export function hasStatus(x: any): x is HttpStatus {
    return x != null && x['statusCode'] != null;
}
export type LambdaHttpReturnType = ALBResult | CloudFrontRequestResult;
export class LambdaFunction {
    /**
     *  Wrap a lambda function to provide extra functionality
     *
     * - Log metadata about the call on every request
     * - Catch errors and log them before exiting
     */
    public static wrap<T, K extends LambdaHttpReturnType>(
        fn: (event: T, context: Context, logger: pino.Logger) => Promise<K>,
        logger = Logger,
    ): (event: T, context: Context, callback: Callback<K>) => Promise<void> {
        return async (event: T, context: Context, callback: Callback<K>): Promise<void> => {
            const startTime = Date.now();

            const lambda = {
                name: process.env['AWS_LAMBDA_FUNCTION_NAME'],
                memory: process.env['AWS_LAMBDA_FUNCTION_MEMORY_SIZE'],
                version: process.env['AWS_LAMBDA_FUNCTION_VERSION'],
                region: process.env['AWS_REGION'],
            };

            logger.info({ lambda }, 'LambdaStart');

            try {
                const res = await fn(event, context, logger);
                let status = 200;
                let statusDescription = 'ok';
                if (hasStatus(res)) {
                    status = parseInt(res.statusCode, 10);
                    statusDescription = res.statusDescription;
                }
                logger.info({ lambda, duration: Date.now() - startTime, status, statusDescription }, 'LambdaDone');
                callback(null, res);
            } catch (error) {
                logger.info({ lambda, duration: Date.now() - startTime, status: 500, error: error }, 'LambdaError');
                callback(error);
            }
        };
    }
}