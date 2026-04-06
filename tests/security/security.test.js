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
    it('renvoie les headers OWASP sur /login', async () => {
      const res = await request(app).get('/login');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('DENY');
      expect(res.headers['x-xss-protection']).toBe('0');
      expect(res.headers['referrer-policy']).toBe(
        'strict-origin-when-cross-origin',
      );
      expect(res.headers['permissions-policy']).toBeDefined();
    });
  });

  describe('Accès non authentifié', () => {
    it('redirige /dashboard vers /login', async () => {
      const res = await request(app).get('/dashboard');
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/login');
    });

    it('redirige /admin vers /login', async () => {
      const res = await request(app).get('/admin');
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/login');
    });

    it('redirige /chantier vers /login', async () => {
      const res = await request(app).get('/chantier');
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/login');
    });

    it('redirige /equipe vers /login', async () => {
      const res = await request(app).get('/equipe');
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/login');
    });

    it('redirige /competence vers /login', async () => {
      const res = await request(app).get('/competence');
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/login');
    });
  });

  describe('Pages publiques', () => {
    it('accède à /login sans redirection', async () => {
      const res = await request(app).get('/login');
      expect(res.status).toBe(200);
    });

    it('accède à /mentions-legales sans redirection', async () => {
      const res = await request(app).get('/mentions-legales');
      expect(res.status).toBe(200);
    });
  });

  describe('Protection CSRF', () => {
    it('rejette POST /login sans token CSRF', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: 'test@test.com', password: 'test' });
      expect(res.status).toBe(403);
    });
  });
});
