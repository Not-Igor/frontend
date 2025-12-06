import apiService from './apiService';

export interface CompetitionCreateRequest {
  title: string;
  icon: string;
  participantIds: number[];
}

export interface UserDto {
  id: number;
  username: string;
  email: string | null;
  role: string;
}

export interface CompetitionDto {
  id: number;
  title: string;
  icon: string;
  creator: UserDto;
  participants: UserDto[];
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantDto {
  id: number;
  username: string;
  wins: number;
  matchesPlayed: number;
  draws: number;
  losses: number;
  pointsScored: number;
}

class CompetitionService {
  async createCompetition(data: CompetitionCreateRequest): Promise<CompetitionDto> {
    return await apiService.post<CompetitionDto>('/competitions', data);
  }

  async getCompetition(id: number): Promise<CompetitionDto> {
    return await apiService.get<CompetitionDto>(`/competitions/${id}`);
  }

  async getUserCompetitions(userId: number): Promise<CompetitionDto[]> {
    return await apiService.get<CompetitionDto[]>(`/competitions/user/${userId}`);
  }

  async getCompetitionsCreatedByUser(userId: number): Promise<CompetitionDto[]> {
    return await apiService.get<CompetitionDto[]>(`/competitions/created-by/${userId}`);
  }

  async getParticipants(competitionId: number): Promise<ParticipantDto[]> {
    return await apiService.get<ParticipantDto[]>(`/competitions/${competitionId}/participants`);
  }

  async deleteCompetition(competitionId: number): Promise<void> {
    return await apiService.delete(`/competitions/${competitionId}`);
  }

  async addParticipants(competitionId: number, participantIds: number[]): Promise<CompetitionDto> {
    return await apiService.post<CompetitionDto>(`/competitions/${competitionId}/participants`, { participantIds });
  }

  async leaveCompetition(competitionId: number): Promise<void> {
    return await apiService.delete(`/competitions/${competitionId}/leave`);
  }
}

export default new CompetitionService();
