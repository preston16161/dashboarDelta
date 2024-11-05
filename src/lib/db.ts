import Dexie from 'dexie';

export interface User {
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

class AppDatabase extends Dexie {
  users!: Dexie.Table<User, number>;

  constructor() {
    super('RegimentDB');
    this.version(1).stores({
      users: '++id, username, password, name, rank, division, status, email, phone, joinDate'
    });
  }

  async initializeAdmin() {
    const adminExists = await this.users.where('username').equals('admin').count();
    if (adminExists === 0) {
      await this.users.add({
        username: 'admin',
        password: 'admin',
        name: 'Administrateur',
        rank: 'Administrateur',
        division: 'Commandement',
        status: 'Actif',
        email: 'admin@regiment.fr',
        phone: '+33 0 00 00 00 00',
        joinDate: new Date().toISOString().split('T')[0]
      });
    }
  }
}

export const db = new AppDatabase();

export async function initDb() {
  try {
    await db.initializeAdmin();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}