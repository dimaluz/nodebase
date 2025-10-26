'use server';

export type Workflow = {
  id: string;
  title: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  updatedAt: string;
};

export type FetchWorkflowsOptions = {
  bearerToken?: string;
  userId?: string;
};

export type CreateWorkflowPayload = {
  title: string;
  status?: Workflow['status'];
};

const mockWorkflows: Workflow[] = [
  {
    id: 'wf_001',
    title: 'Customer Onboarding',
    status: 'active',
    updatedAt: new Date('2024-02-10T12:00:00Z').toISOString(),
  },
  {
    id: 'wf_002',
    title: 'Invoice Approval',
    status: 'draft',
    updatedAt: new Date('2024-02-05T08:30:00Z').toISOString(),
  },
  {
    id: 'wf_003',
    title: 'NPS Survey',
    status: 'paused',
    updatedAt: new Date('2024-01-28T14:15:00Z').toISOString(),
  },
];

const shouldUseMock = () => {
  if (!process.env.BFF_BASE_URL && process.env.NODE_ENV !== 'production') {
    return true;
  }
  return false;
};

const buildHeaders = (options: FetchWorkflowsOptions) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.bearerToken) {
    headers.Authorization = `Bearer ${options.bearerToken}`;
  }
  if (options.userId) {
    headers['x-user-id'] = options.userId;
  }
  return headers;
};

const requestWorkflowsFromBff = async (
  options: FetchWorkflowsOptions,
): Promise<Workflow[] | null> => {
  const baseUrl = process.env.BFF_BASE_URL;
  if (!baseUrl) return null;

  const url = new URL('/workflows', baseUrl);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: buildHeaders(options),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Failed to fetch workflows from BFF: ${response.status}`);
      return null;
    }

    const payload = (await response.json()) as { workflows?: Workflow[] };
    if (!payload.workflows || payload.workflows.length === 0) {
      return null;
    }

    return payload.workflows;
  } catch (error) {
    console.error('[workflows-service] Error contacting BFF:', error);
    return null;
  }
};

export const getWorkflows = async (
  options: FetchWorkflowsOptions = {},
): Promise<Workflow[]> => {
  if (shouldUseMock()) {
    return mockWorkflows;
  }

  const result = await requestWorkflowsFromBff(options);
  return result ?? mockWorkflows;
};

const requestCreateWorkflowFromBff = async (
  payload: CreateWorkflowPayload,
  options: FetchWorkflowsOptions,
): Promise<Workflow | null> => {
  const baseUrl = process.env.BFF_BASE_URL;
  if (!baseUrl) return null;

  const url = new URL('/workflows', baseUrl);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: buildHeaders(options),
      cache: 'no-store',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Failed to create workflow via BFF: ${response.status}`);
      return null;
    }

    const result = (await response.json()) as { workflow?: Workflow };
    return result.workflow ?? null;
  } catch (error) {
    console.error('[workflows-service] Error creating workflow via BFF:', error);
    return null;
  }
};

export const createWorkflow = async (
  payload: CreateWorkflowPayload,
  options: FetchWorkflowsOptions = {},
): Promise<Workflow> => {
  if (shouldUseMock()) {
    return {
      id: `wf_${Date.now()}`,
      title: payload.title,
      status: payload.status ?? 'draft',
      updatedAt: new Date().toISOString(),
    } satisfies Workflow;
  }

  const created = await requestCreateWorkflowFromBff(payload, options);
  if (created) {
    return created;
  }

  return {
    id: `wf_${Date.now()}`,
    title: payload.title,
    status: payload.status ?? 'draft',
    updatedAt: new Date().toISOString(),
  } satisfies Workflow;
};
