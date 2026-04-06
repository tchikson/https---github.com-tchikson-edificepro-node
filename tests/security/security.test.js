/**
 * Tests de sécurité : headers, CSRF, accès non-authentifié, rôles.
 */
const request = require('supertest');

// Mock de Sequelize pour éviter la connexion DB
jest.mock('../../src/models', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(true),
    sync: jest.fn().mockResolvedValue(true),
  },
  User: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
  },
  Chantier: { findAll: jest.fn().mockResolvedValue([]) },
  Equipe: { findAll: jest.fn().mockResolvedValue([]) },
  Competence: { findAll: jest.fn().mockResolvedValue([]) },
  Affectation: { findAll: jest.fn().mockResolvedValue([]) },
  CompetenceChantier: { findAll: jest.fn().mockResolvedValue([]) },
  CompetenceUser: { findAll: jest.fn().mockResolvedValue([]) },
  EquipeUser: { findAll: jest.fn().mockResolvedValue([]) },
}));

const app = require('../../src/app');

describe('Sécurité', () => {
  describe('Headers de sécurité', () => {
    it('renvoie les headers OWASP sur /api/csrf-token', async () => {
      const res = await request(app).get('/api/csrf-token');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('DENY');
      expect(res.headers['x-xss-protection']).toBe('0');
      expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
      expect(res.headers['permissions-policy']).toBeDefined();
    });
  });

  describe('Accès non authentifié', () => {
    it('renvoie 401 sur /api/dashboard', async () => {
      const res = await request(app).get('/api/dashboard');
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it('renvoie 401 sur /api/admin', async () => {
      const res = await request(app).get('/api/admin');
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it('renvoie 401 sur /api/chantiers', async () => {
      const res = await request(app).get('/api/chantiers');
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it('renvoie 401 sur /api/equipes', async () => {
      const res = await request(app).get('/api/equipes');
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it('renvoie 401 sur /api/competences', async () => {
      const res = await request(app).get('/api/competences');
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('Pages publiques', () => {
    it('accède à /api/csrf-token sans authentification', async () => {
      const res = await request(app).get('/api/csrf-token');
      expect(res.status).toBe(200);
      expect(res.body.csrfToken).toBeDefined();
    });

    it('accède à /api/mentions-legales sans authentification', async () => {
      const res = await request(app).get('/api/mentions-legales');
      expect(res.status).toBe(200);
    });
  });

  describe('Protection CSRF', () => {
    it('rejette POST /api/auth/login sans token CSRF', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'test' });
      expect(res.status).toBe(403);
    });
  });
});
