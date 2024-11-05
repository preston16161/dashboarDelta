import Dexie, { Table } from 'dexie';

export interface Member {
  id?: number;
  username: string;
  password: string;
  name: string;
  rank: string;
  division: string;
  status: string;
  email: string;
  phone: string;
  joinDate: string;
}

export class RegimentDatabase extends Dexie {
  members!: Table<Member>;

  constructor() {
    super('RegimentDB');
    this.version(1).stores({
      members: '++id, username, name, rank, division, status, email, phone, joinDate'
    });
  }
}

export const db = new RegimentDatabase();

export const addMember = async (member: Omit<Member, 'id' | 'status' | 'joinDate'>) => {
  return await db.members.add({
    ...member,
    status: 'Actif',
    joinDate: new Date().toISOString().split('T')[0]
  });
};

export const updateMember = async (id: number, updates: Partial<Member>) => {
  return await db.members.update(id, updates);
};

export const updateMemberStatus = async (id: number, status: string) => {
  return await db.members.update(id, { status });
};

export const getMembers = async () => {
  return await db.members.toArray();
};

export const getMemberByUsername = async (username: string) => {
  return await db.members.where('username').equals(username).first();
};

export const initializeAdmin = async () => {
  const adminExists = await db.members.where('username').equals('admin').count();
  if (adminExists === 0) {
    await addMember({
      username: 'admin',
      password: 'admin',
      name: 'Administrateur',
      rank: 'Administrateur',
      division: 'Commandement',
      email: 'admin@regiment.fr',
      phone: '+33 0 00 00 00 00'
    });
  }
};