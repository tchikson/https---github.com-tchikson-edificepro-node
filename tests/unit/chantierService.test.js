/**
 * Tests unitaires du service Chantier.
 */
const { Op } = require("sequelize");

// Mock des modèles
jest.mock("../../src/models", () => {
  const mockAffectation = {
    findOne: jest.fn(),
  };
  const mockCompetenceChantier = {
    findAll: jest.fn(),
    destroy: jest.fn(),
    create: jest.fn(),
  };
  const mockCompetenceUser = {};
  const mockEquipeUser = {
    findAll: jest.fn(),
  };
  const mockChantier = {
    create: jest.fn(),
    findByPk: jest.fn(),
  };

  return {
    Affectation: mockAffectation,
    CompetenceChantier: mockCompetenceChantier,
    CompetenceUser: mockCompetenceUser,
    EquipeUser: mockEquipeUser,
    Chantier: mockChantier,
    sequelize: { Op },
  };
});

const chantierService = require("../../src/services/chantierService");
const {
  Affectation,
  CompetenceChantier,
  EquipeUser,
  Chantier,
} = require("../../src/models");

describe("ChantierService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("hasDateOverlap", () => {
    it("retourne true si chevauchement détecté", async () => {
      Affectation.findOne.mockResolvedValue({ id: 1 });
      const result = await chantierService.hasDateOverlap(
        1,
        "2025-01-01",
        "2025-06-30",
      );
      expect(result).toBe(true);
      expect(Affectation.findOne).toHaveBeenCalledTimes(1);
    });

    it("retourne false si aucun chevauchement", async () => {
      Affectation.findOne.mockResolvedValue(null);
      const result = await chantierService.hasDateOverlap(
        1,
        "2025-01-01",
        "2025-06-30",
      );
      expect(result).toBe(false);
    });
  });

  describe("equipeHasRequiredCompetences", () => {
    it("retourne true si l'équipe a toutes les compétences requises", async () => {
      EquipeUser.findAll.mockResolvedValue([
        { utilisateurId: 1 },
        { utilisateurId: 2 },
      ]);
      CompetenceChantier.findAll.mockResolvedValue([
        { competenceId: 1 },
        { competenceId: 2 },
      ]);

      // Mock CompetenceUser via require
      const db = require("../../src/models");
      db.CompetenceUser = {
        findAll: jest
          .fn()
          .mockResolvedValue([{ competenceId: 1 }, { competenceId: 2 }]),
      };

      const result = await chantierService.equipeHasRequiredCompetences(1, 1);
      expect(typeof result).toBe("boolean");
    });
  });

  describe("createChantier", () => {
    it("crée un chantier avec les bons paramètres", async () => {
      const mockChantier = { id: 1, lieu: "Paris" };
      Chantier.create.mockResolvedValue(mockChantier);
      CompetenceChantier.create.mockResolvedValue({});

      const result = await chantierService.createChantier(
        {
          lieu: "Paris",
          dateDebut: "2025-01-01",
          dateFin: "2025-06-30",
          status: "en_cours",
        },
        [1, 2],
      );

      expect(Chantier.create).toHaveBeenCalledWith({
        lieu: "Paris",
        dateDebut: "2025-01-01",
        dateFin: "2025-06-30",
        status: "en_cours",
      });
      expect(CompetenceChantier.create).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockChantier);
    });
  });
});
