import { site } from '../data/site';
import ButtonLink from './ButtonLink';
import { ExternalIcon } from './Icons';

export default function ShopTeaser() {
  return (
    <section className="section shop-teaser">
      <div className="container image-copy-grid reverse">
        <div className="glass-panel content-panel">
          <span className="section-kicker">Shop</span>
          <h2>Carry the creative energy beyond the screen.</h2>
          <p>
            Feature one product, campaign item or merchandise image here, then send visitors to the external store in a new tab.
            This keeps the main website focused while still making the shop easy to reach.
          </p>
          <ButtonLink href={site.shopUrl} variant="soft" external>
            Visit the shop <ExternalIcon />
          </ButtonLink>
        </div>
        <div className="image-frame product-frame">
          <img src="/assets/shop-product-placeholder.svg" alt="Featured shop product placeholder" />
        </div>
      </div>
    </section>
  );
}
