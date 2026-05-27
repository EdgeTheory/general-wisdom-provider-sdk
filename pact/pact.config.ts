import path from 'path';
import { fileURLToPath } from 'url';
import { PactV4, MatchersV3 } from '@pact-foundation/pact';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const pactConfig = {
  consumer: 'gw-sdk',
  dir: path.resolve(__dirname, 'pacts'),
  logLevel: 'warn' as const,
};

export const { like, eachLike, regex, integer, decimal, boolean, string, timestamp } = MatchersV3;

export function createPact(provider: string) {
  return new PactV4({
    consumer: pactConfig.consumer,
    provider,
    dir: pactConfig.dir,
    logLevel: pactConfig.logLevel,
  });
}
