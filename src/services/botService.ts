import apiService from './apiService';

export interface BotDto {
  id: number;
  username: string;
}

export interface BotCreateDto {
  count: number;
  usernames: string[];
}

const botService = {
  getBots: async (competitionId: number): Promise<BotDto[]> => {
    return await apiService.get<BotDto[]>(`/api/competitions/${competitionId}/bots`);
  },

  createBots: async (competitionId: number, data: BotCreateDto): Promise<BotDto[]> => {
    return await apiService.post<BotDto[]>(`/api/competitions/${competitionId}/bots`, data);
  },

  deleteBots: async (competitionId: number): Promise<void> => {
    await apiService.delete(`/api/competitions/${competitionId}/bots`);
  }
};

export default botService;
