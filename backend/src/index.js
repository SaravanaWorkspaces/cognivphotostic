module.exports = {
  register(/* { strapi } */) {},
  async bootstrap({ strapi }) {
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (!publicRole) return;

      const contentTypes = ['category', 'post', 'tag', 'product'];
      for (const contentType of contentTypes) {
        const findAction = `api::${contentType}.${contentType}.find`;
        const findOneAction = `api::${contentType}.${contentType}.findOne`;

        const findExists = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action: findAction, role: publicRole.id } });

        if (!findExists) {
          await strapi.query('plugin::users-permissions.permission').create({
            action: findAction,
            role: publicRole.id,
          });
        }

        const findOneExists = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action: findOneAction, role: publicRole.id } });

        if (!findOneExists) {
          await strapi.query('plugin::users-permissions.permission').create({
            action: findOneAction,
            role: publicRole.id,
          });
        }
      }

      // Special case for affiliate-click — only allow create, not read
      const createAction = 'api::affiliate-click.affiliate-click.create';
      const createExists = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action: createAction, role: publicRole.id } });
      if (!createExists) {
        await strapi.query('plugin::users-permissions.permission').create({
          action: createAction,
          role: publicRole.id,
        });
      }

      strapi.log.info('✓ Public API permissions configured');
    } catch (err) {
      // Silently fail - admin may not be set up yet
    }
  },
};
