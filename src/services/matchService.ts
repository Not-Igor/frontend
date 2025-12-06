import apiService from './apiService';
import { UserDto } from './competitionService';

export enum MatchStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface MatchCreateRequest {
  competitionId: number;
  title?: string;
  participantIds: number[];
}

export interface MatchDto {
  id: number;
  title: string;
  matchNumber: number;
  competitionId: number;
  participants: UserDto[];
  status: MatchStatus;
  startedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

class MatchService {
  async createMatch(data: MatchCreateRequest): Promise<MatchDto> {
    return await apiService.post<MatchDto>('/matches', data);
  }

  async getMatchesByCompetition(competitionId: number): Promise<MatchDto[]> {
    return await apiService.get<MatchDto[]>(`/matches/competition/${competitionId}`);
  }

  async getMatch(matchId: number): Promise<MatchDto> {
    return await apiService.get<MatchDto>(`/matches/${matchId}`);
  }

  async startMatch(matchId: number): Promise<MatchDto> {
    return await apiService.post<MatchDto>(`/matches/${matchId}/start`, {});
  }

  async deleteMatch(matchId: number): Promise<void> {
    return await apiService.delete(`/matches/${matchId}`);
  }
}

export default new MatchService();
