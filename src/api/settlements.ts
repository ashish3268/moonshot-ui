import apiClient from './client';

export interface SettlementCreatePayload {
  toUserId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface SettlementUpdatePayload {
  amount?: number;
  note?: string;
  date?: string;
}

export async function createSettlement(body: SettlementCreatePayload): Promise<void> {
  await apiClient.post('/api/v1/settlements', {
    to_user_id: body.toUserId,
    amount: body.amount,
    date: body.date,
    note: body.note ?? null,
  });
}

export async function updateSettlement(id: string, body: SettlementUpdatePayload): Promise<void> {
  await apiClient.patch(`/api/v1/settlements/${id}`, body);
}

export async function deleteSettlementById(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/settlements/${id}`);
}
