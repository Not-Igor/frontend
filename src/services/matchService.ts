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

export interface MatchScoreDto {
  userId: number;
  username: string;
  score: number;
  confirmed: boolean;
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
  scores: MatchScoreDto[];
  scoresSubmitted: boolean;
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

  async submitScores(matchId: number, scores: Record<number, number>): Promise<MatchDto> {
    return await apiService.post<MatchDto>(`/matches/${matchId}/scores`, {
      matchId,
      scores
    });
  }

}

export default new MatchService();
