/**
 * Tests unitaires du service Equipe.
 */

jest.mock('../../src/models', () => {
  const mockEquipeUser = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    create: jest.fn(),
  };
  const mockEquipe = {
    create: jest.fn(),
    findByPk: jest.fn(),
  };
  const mockAffectation = {
    destroy: jest.fn(),
  };
  const mockSequelize = {
    transaction: jest.fn(async (callback) => callback({})),
  };

  return {
    EquipeUser: mockEquipeUser,
    Equipe: mockEquipe,
    Affectation: mockAffectation,
    sequelize: mockSequelize,
  };
});

const equipeService = require('../../src/services/equipeService');
const { EquipeUser, Equipe, Affectation, sequelize } = require('../../src/models');

describe('EquipeService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('findConflictingAssignment', () => {
    it('retourne null si aucun conflit', async () => {
      EquipeUser.findOne.mockResolvedValue(null);
      const result = await equipeService.findConflictingAssignment(
        1,
        '2025-01-01',
        '2025-06-30',
        null,
      );
      expect(result).toBeNull();
    });

    it('retourne le conflit si existant', async () => {
      const conflict = { id: 5, equipeId: 3 };
      EquipeUser.findOne.mockResolvedValue(conflict);
      const result = await equipeService.findConflictingAssignment(
        1,
        '2025-01-01',
        '2025-06-30',
        null,
      );
      expect(result).toEqual(conflict);
    });
  });

  describe('createEquipe', () => {
    it('crée une équipe avec les bons paramètres', async () => {
      const mockEquipe = { id: 1, nomEquipe: 'Alpha' };
      Equipe.create.mockResolvedValue(mockEquipe);
      EquipeUser.create.mockResolvedValue({});

      const result = await equipeService.createEquipe(
        {
          nomEquipe: 'Alpha',
          chefEquipeId: 1,
          dateDebut: '2025-01-01',
          dateFin: '2025-06-30',
        },
        [2, 3],
      );

      expect(Equipe.create).toHaveBeenCalledWith(
        {
          nomEquipe: 'Alpha',
          chefEquipeId: 1,
          dateDebut: '2025-01-01',
          dateFin: '2025-06-30',
        },
        { transaction: {} },
      );
      expect(EquipeUser.create).toHaveBeenCalledTimes(2);
      expect(EquipeUser.create).toHaveBeenCalledWith(
        {
          equipeId: 1,
          utilisateurId: 2,
          dateDebut: '2025-01-01',
          dateFin: '2025-06-30',
        },
        { transaction: {} },
      );
      expect(result).toEqual(mockEquipe);
      expect(sequelize.transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteEquipe', () => {
    it('supprime équipe et relations en cascade', async () => {
      const mockEquipe = { id: 1, destroy: jest.fn() };
      Equipe.findByPk.mockResolvedValue(mockEquipe);
      EquipeUser.destroy.mockResolvedValue(2);
      Affectation.destroy.mockResolvedValue(1);

      await equipeService.deleteEquipe(1);

      expect(EquipeUser.destroy).toHaveBeenCalledWith({
        where: { equipeId: 1 },
      });
      expect(Affectation.destroy).toHaveBeenCalledWith({
        where: { equipeId: 1 },
      });
      expect(mockEquipe.destroy).toHaveBeenCalled();
    });
  });
});
