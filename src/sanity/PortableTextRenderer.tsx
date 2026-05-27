'use client';

import {PortableText} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';

type PortableTextRendererProps = {
  value?: PortableTextBlock[] | null;
};

export default function PortableTextRenderer({value}: PortableTextRendererProps) {
  if (!value?.length) {
    return null;
  }

  return <PortableText value={value} />;
}
