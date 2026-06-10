'use client';

import {PortableText, type PortableTextComponents} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';
import {urlForImage} from '@/sanity/lib/image';

type PortableTextRendererProps = {
  value?: PortableTextBlock[] | null;
};

type BodyImageSize = 'small' | 'medium' | 'large' | 'full';
type BodyImageAlignment = 'left' | 'right' | 'center';

type PortableTextBodyImage = {
  _type?: 'bodyImage';
  alt?: string;
  caption?: string;
  size?: BodyImageSize;
  alignment?: BodyImageAlignment;
  asset?: {
    _ref?: string;
    _id?: string;
    url?: string;
  };
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  hotspot?: {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
  };
};

const imageSizeClasses: Record<BodyImageSize, string> = {
  small: 'portable-text-image-small',
  medium: 'portable-text-image-medium',
  large: 'portable-text-image-large',
  full: 'portable-text-image-full',
};

const imageAlignmentClasses: Record<BodyImageAlignment, string> = {
  left: 'portable-text-image-left',
  right: 'portable-text-image-right',
  center: 'portable-text-image-center',
};

function normalizeImageSize(size?: string): BodyImageSize {
  return size === 'small' || size === 'medium' || size === 'large' || size === 'full' ? size : 'large';
}

function normalizeImageAlignment(alignment?: string): BodyImageAlignment {
  return alignment === 'left' || alignment === 'right' || alignment === 'center' ? alignment : 'center';
}

function buildBodyImageUrl(image: PortableTextBodyImage, size: BodyImageSize) {
  const widths: Record<BodyImageSize, number> = {
    small: 520,
    medium: 760,
    large: 1080,
    full: 1440,
  };

  return urlForImage(image)?.width(widths[size]).fit('max').auto('format').url() || image.asset?.url;
}

function PortableTextBodyImage({value}: {value: PortableTextBodyImage}) {
  const size = normalizeImageSize(value.size);
  const alignment = normalizeImageAlignment(value.alignment);
  const imageUrl = buildBodyImageUrl(value, size);

  if (!imageUrl) {
    return null;
  }

  const className = [
    'portable-text-image',
    imageSizeClasses[size],
    imageAlignmentClasses[alignment],
  ].join(' ');

  return (
    <figure className={className}>
      <img src={imageUrl} alt={value.alt || ''} loading="lazy" />
      {value.caption ? <figcaption>{value.caption}</figcaption> : null}
    </figure>
  );
}

const portableTextComponents: PortableTextComponents = {
  types: {
    bodyImage: PortableTextBodyImage,
  },
  marks: {
    link: ({children, value}) => {
      const href = typeof value?.href === 'string' ? value.href : '';
      const isExternal = /^https?:\/\//.test(href);

      if (!href) {
        return <>{children}</>;
      }

      return (
        <a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined}>
          {children}
        </a>
      );
    },
    textColor: ({children, value}) => {
      const color = typeof value?.color === 'string' ? value.color : '';
      const className = ['cyan', 'magenta', 'yellow', 'ink'].includes(color)
        ? `portable-text-color-${color}`
        : '';

      return className ? <span className={className}>{children}</span> : <>{children}</>;
    },
  },
};

export default function PortableTextRenderer({value}: PortableTextRendererProps) {
  if (!value?.length) {
    return null;
  }

  return <PortableText value={value} components={portableTextComponents} />;
}
