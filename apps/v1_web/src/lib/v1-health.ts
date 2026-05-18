type HealthResponse = {
  status: 'success';
  data: {
    service: string;
    checks: {
      db: boolean;
    };
  };
  timestamp: string;
};

type HealthResult = {
  ok: boolean;
  service: string;
};

export async function getV1Health(): Promise<HealthResult> {
  const origin = process.env.INTERNAL_API_ORIGIN || 'http://localhost:8121';

  try {
    const response = await fetch(`${origin}/api/v1/health`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return { ok: false, service: 'v1_api' };
    }

    const payload = (await response.json()) as HealthResponse;

    return {
      ok: payload.data.checks.db,
      service: payload.data.service,
    };
  } catch {
    return { ok: false, service: 'v1_api' };
  }
}
