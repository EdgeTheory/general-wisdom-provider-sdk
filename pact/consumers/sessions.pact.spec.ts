import { describe, it, expect } from 'vitest';
import { createPact, regex, integer, string } from '../pact.config.js';

const SESSION_JWT_RE = /^Bearer [A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const TEST_SESSION_ID = 'session-001';   // matches gw-sdk-api/tests/pact provider-test seed

describe('SDK Sessions API Consumer Contract', () => {
  const provider = createPact('gw-sdk-api');

  describe('POST /v1/sdk/sessions/{session_id}/heartbeat', () => {
    it('records a heartbeat for an active session', async () => {
      await provider
        .addInteraction()
        .given('an active session with id session-001 exists')
        .uponReceiving('a session heartbeat')
        .withRequest('POST', `/v1/sdk/sessions/${TEST_SESSION_ID}/heartbeat`, (b) => {
          b.headers({
            Authorization: regex(SESSION_JWT_RE, 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJzZXNzaW9uSWQiOiJzZXNzaW9uLTAwMSJ9.signature'),
            'Content-Type': 'application/json',
          });
          b.jsonBody({ timestamp: integer(1779819406000), active: true });
        })
        .willRespondWith(200, (b) => {
          b.headers({ 'Content-Type': 'application/json' });
          b.jsonBody({ remaining_seconds: integer(7200) });
        })
        .executeTest(async (mockServer) => {
          const res = await fetch(`${mockServer.url}/v1/sdk/sessions/${TEST_SESSION_ID}/heartbeat`, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJzZXNzaW9uSWQiOiJzZXNzaW9uLTAwMSJ9.signature',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ timestamp: 1779819406000, active: true }),
          });
          expect(res.status).toBe(200);
          const data = await res.json();
          expect(typeof data.remaining_seconds).toBe('number');
        });
    });
  });

  describe('POST /v1/sdk/sessions/{session_id}/extend', () => {
    it('extends an active session', async () => {
      await provider
        .addInteraction()
        .given('an active session with id session-001 exists')
        .uponReceiving('a session extension request')
        .withRequest('POST', `/v1/sdk/sessions/${TEST_SESSION_ID}/extend`, (b) => {
          b.headers({
            Authorization: regex(SESSION_JWT_RE, 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJzZXNzaW9uSWQiOiJzZXNzaW9uLTAwMSJ9.signature'),
            'Content-Type': 'application/json',
          });
          b.jsonBody({
            extensionMinutes: integer(15),
            idempotencyKey: regex(
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
              '00000000-0000-4000-a000-000000000003',
            ),
          });
        })
        .willRespondWith(200, (b) => {
          b.headers({ 'Content-Type': 'application/json' });
          b.jsonBody({
            sessionId: string(TEST_SESSION_ID),
            newExpiresAt: integer(1779820000),
          });
        })
        .executeTest(async (mockServer) => {
          const res = await fetch(`${mockServer.url}/v1/sdk/sessions/${TEST_SESSION_ID}/extend`, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJzZXNzaW9uSWQiOiJzZXNzaW9uLTAwMSJ9.signature',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              extensionMinutes: 15,
              idempotencyKey: '00000000-0000-4000-a000-000000000003',
            }),
          });
          expect(res.status).toBe(200);
          const data = await res.json();
          expect(typeof data.newExpiresAt).toBe('number');
        });
    });
  });
});
