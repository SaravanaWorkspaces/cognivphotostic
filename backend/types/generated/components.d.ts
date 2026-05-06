import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksComparisonRow extends Struct.ComponentSchema {
  collectionName: 'components_blocks_comparison_rows';
  info: {
    displayName: 'Comparison Row';
  };
  attributes: {
    feature: Schema.Attribute.String & Schema.Attribute.Required;
    values: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksComparisonTable extends Struct.ComponentSchema {
  collectionName: 'components_blocks_comparison_tables';
  info: {
    displayName: 'Comparison Table Block';
  };
  attributes: {
    rows: Schema.Attribute.Component<'blocks.comparison-row', true>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksGallery extends Struct.ComponentSchema {
  collectionName: 'components_blocks_galleries';
  info: {
    displayName: 'Gallery Block';
  };
  attributes: {
    images: Schema.Attribute.Media<undefined, true> & Schema.Attribute.Required;
  };
}

export interface BlocksImage extends Struct.ComponentSchema {
  collectionName: 'components_blocks_images';
  info: {
    displayName: 'Image Block';
  };
  attributes: {
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media & Schema.Attribute.Required;
  };
}

export interface BlocksProductEmbed extends Struct.ComponentSchema {
  collectionName: 'components_blocks_product_embeds';
  info: {
    displayName: 'Product Embed Block';
  };
  attributes: {
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
  };
}

export interface BlocksText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_texts';
  info: {
    displayName: 'Text Block';
  };
  attributes: {
    body: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 5000;
        minLength: 1000;
      }>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String;
    ogImage: Schema.Attribute.Media;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.comparison-row': BlocksComparisonRow;
      'blocks.comparison-table': BlocksComparisonTable;
      'blocks.gallery': BlocksGallery;
      'blocks.image': BlocksImage;
      'blocks.product-embed': BlocksProductEmbed;
      'blocks.text': BlocksText;
      'shared.seo': SharedSeo;
    }
  }
}
