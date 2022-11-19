import ITeams from '../requests/ITeams';

export default interface ITeamService {
  getAll(): Promise<ITeams[]>,
  getById(id: string): Promise<ITeams | null>
}
