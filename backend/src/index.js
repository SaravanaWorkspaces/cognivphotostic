'use strict';

const { categories: taxonomyCategories, tags: taxonomyTags } = require('./data/taxonomy');

module.exports = {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }) {
    await setupPublicPermissions(strapi);
    await setupAuthenticatedPermissions(strapi);
    await provisionAdminUser(strapi);
    await seedTaxonomy(strapi);
  },
};

// ─── Public role: read-only on content, create-only on affiliate clicks ───────
async function setupPublicPermissions(strapi) {
  try {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    const readActions = ['category', 'post', 'tag', 'product'].flatMap(ct => [
      `api::${ct}.${ct}.find`,
      `api::${ct}.${ct}.findOne`,
    ]);

    const allActions = [
      ...readActions,
      'api::affiliate-click.affiliate-click.create',
    ];

    for (const action of allActions) {
      const exists = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action, role: publicRole.id } });

      if (!exists) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action, role: publicRole.id },
        });
      }
    }

    strapi.log.info('✓ Public permissions ready');
  } catch (err) {
    strapi.log.warn('⚠ Could not configure public permissions:', err.message);
  }
}

// ─── Authenticated role: full admin access ────────────────────────────────────
async function setupAuthenticatedPermissions(strapi) {
  try {
    const role = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'authenticated' } });

    if (!role) return;

    const actions = [
      // Posts — full CRUD
      'api::post.post.find',
      'api::post.post.findOne',
      'api::post.post.create',
      'api::post.post.update',
      'api::post.post.delete',
      // Categories
      'api::category.category.find',
      'api::category.category.findOne',
      'api::category.category.create',
      'api::category.category.update',
      // Tags
      'api::tag.tag.find',
      'api::tag.tag.findOne',
      'api::tag.tag.create',
      // Products
      'api::product.product.find',
      'api::product.product.findOne',
      'api::product.product.create',
      'api::product.product.update',
      'api::product.product.delete',
      // Media upload
      'plugin::upload.content-api.upload',
      'plugin::upload.content-api.find',
      'plugin::upload.content-api.findOne',
      'plugin::upload.content-api.destroy',
    ];

    for (const action of actions) {
      const exists = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action, role: role.id } });

      if (!exists) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action, role: role.id },
        });
      }
    }

    strapi.log.info('✓ Authenticated permissions ready');
  } catch (err) {
    strapi.log.warn('⚠ Could not configure authenticated permissions:', err.message);
  }
}

// ─── Auto-provision admin user on first boot ──────────────────────────────────
async function provisionAdminUser(strapi) {
  const username = process.env.ADMIN_USERNAME;
  const email    = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !email || !password) {
    strapi.log.warn(
      '⚠ Skipping admin user provisioning — set ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD in backend/.env'
    );
    return;
  }

  try {
    const existing = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ where: { email } });

    if (existing) {
      strapi.log.info(`✓ Admin user "${email}" already exists`);
      return;
    }

    const role = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'authenticated' } });

    if (!role) return;

    await strapi.plugin('users-permissions').service('user').add({
      username,
      email,
      password,
      role:      role.id,
      confirmed: true,
      blocked:   false,
      provider:  'local',
    });

    strapi.log.info(`✓ Admin user "${username}" <${email}> created`);
  } catch (err) {
    strapi.log.error('✗ Admin user provisioning failed:', err.message);
  }
}

// ─── Taxonomy seed: idempotent — match by slug, create or update ──────────────
async function seedTaxonomy(strapi) {
  try {
    // Pass 1: upsert every category without parent links so all rows exist.
    const slugToId = {};
    for (const cat of taxonomyCategories) {
      const existing = await strapi.documents('api::category.category').findFirst({
        filters: { slug: cat.slug },
      });

      const payload = {
        name: cat.name,
        slug: cat.slug,
        description: cat.description || null,
      };

      if (existing) {
        await strapi.documents('api::category.category').update({
          documentId: existing.documentId,
          data: payload,
          status: 'published',
        });
        slugToId[cat.slug] = existing.documentId;
      } else {
        const created = await strapi.documents('api::category.category').create({
          data: payload,
          status: 'published',
        });
        slugToId[cat.slug] = created.documentId;
      }
    }

    // Pass 2: link parents now that all documentIds are known.
    for (const cat of taxonomyCategories) {
      if (!cat.parent) continue;
      const parentId = slugToId[cat.parent];
      const childId = slugToId[cat.slug];
      if (!parentId || !childId) continue;

      await strapi.documents('api::category.category').update({
        documentId: childId,
        data: { parent: parentId },
        status: 'published',
      });
    }

    // Tags
    for (const tag of taxonomyTags) {
      const existing = await strapi.documents('api::tag.tag').findFirst({
        filters: { slug: tag.slug },
      });

      const payload = { name: tag.name, slug: tag.slug };

      if (existing) {
        await strapi.documents('api::tag.tag').update({
          documentId: existing.documentId,
          data: payload,
          status: 'published',
        });
      } else {
        await strapi.documents('api::tag.tag').create({
          data: payload,
          status: 'published',
        });
      }
    }

    strapi.log.info(
      `✓ Taxonomy seeded: ${taxonomyCategories.length} categories, ${taxonomyTags.length} tags`
    );
  } catch (err) {
    strapi.log.warn('⚠ Taxonomy seeding failed:', err.message);
  }
}
