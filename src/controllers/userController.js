/**
 * Contrôleur pour la gestion des utilisateurs.
 *
 * CRUD utilisateurs (API JSON) : listing, création, affichage, édition, suppression, profil.
 */
const bcrypt = require('bcryptjs');
const { User, CompetenceUser, EquipeUser, Equipe, Competence } = require('../models');

/**
 * GET /users — Liste tous les utilisateurs.
 */
async function list(req, res) {
  const users = await User.findAll({
    include: [
      {
        model: CompetenceUser,
        as: 'competenceUsers',
        include: [{ model: Competence, as: 'competence' }],
      },
    ],
  });
  res.json(users);
}

/**
 * POST /users — Crée un utilisateur.
 */
async function create(req, res) {
  try {
    const { nom, prenom, email, password, roles, competences } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRoles = roles ? (Array.isArray(roles) ? roles : [roles]) : ['ROLE_USER'];

    const user = await User.create({
      nom,
      prenom,
      email,
      password: hashedPassword,
      roles: userRoles,
    });

    if (competences) {
      const compIds = Array.isArray(competences) ? competences : [competences];
      for (const compId of compIds) {
        await CompetenceUser.create({
          utilisateurId: user.id,
          competenceId: parseInt(compId, 10),
        });
      }
    }

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Erreur lors de la création.' });
  }
}

/**
 * GET /users/profile — Profil de l'utilisateur connecté.
 */
async function profile(req, res) {
  const user = await User.findByPk(req.user.id, {
    include: [
      {
        model: CompetenceUser,
        as: 'competenceUsers',
        include: [{ model: Competence, as: 'competence' }],
      },
      {
        model: EquipeUser,
        as: 'equipeUsers',
        include: [{ model: Equipe, as: 'equipe' }],
      },
    ],
  });
  res.json(user);
}

/**
 * PUT /users/profile — Met à jour le profil de l'utilisateur connecté.
 */
async function updateProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id);
    const { nom, prenom, email, password } = req.body;
    await user.update({ nom, prenom, email });
    if (password) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour du profil.' });
  }
}

/**
 * GET /users/:id — Affiche un utilisateur.
 */
async function show(req, res) {
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: CompetenceUser,
        as: 'competenceUsers',
        include: [{ model: Competence, as: 'competence' }],
      },
      {
        model: EquipeUser,
        as: 'equipeUsers',
        include: [{ model: Equipe, as: 'equipe' }],
      },
    ],
  });
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé.' });
  }
  res.json(user);
}

/**
 * PUT /users/:id — Met à jour un utilisateur.
 */
async function update(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: CompetenceUser, as: 'competenceUsers' },
        { model: EquipeUser, as: 'equipeUsers' },
      ],
    });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    const { nom, prenom, email, password, roles, competences } = req.body;
    await user.update({
      nom,
      prenom,
      email,
      roles: roles ? (Array.isArray(roles) ? roles : [roles]) : user.roles,
    });

    if (password) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    const isAssigned = user.equipeUsers && user.equipeUsers.length > 0;
    if (!isAssigned) {
      await CompetenceUser.destroy({ where: { utilisateurId: user.id } });
      if (competences) {
        const compIds = Array.isArray(competences) ? competences : [competences];
        for (const compId of compIds) {
          await CompetenceUser.create({
            utilisateurId: user.id,
            competenceId: parseInt(compId, 10),
          });
        }
      }
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Erreur lors de la mise à jour.' });
  }
}

/**
 * DELETE /users/:id — Supprime un utilisateur.
 */
async function remove(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    if (req.user.id === user.id) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte.' });
    }

    if (user.hasRole('ROLE_ADMIN')) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer un administrateur.' });
    }

    await CompetenceUser.destroy({ where: { utilisateurId: user.id } });
    await EquipeUser.destroy({ where: { utilisateurId: user.id } });
    await Equipe.update({ chefEquipeId: null }, { where: { chefEquipeId: user.id } });

    await user.destroy();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
}

module.exports = { list, create, profile, updateProfile, show, update, remove };
