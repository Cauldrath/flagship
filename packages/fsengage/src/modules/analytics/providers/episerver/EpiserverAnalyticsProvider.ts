import FSNetwork from '@brandingbrand/fsnetwork';
import AnalyticsProvider, {
  App,
  Checkout,
  CheckoutAction,
  ClickGeneric,
  ContactCall,
  ContactEmail,
  Generics,
  ImpressionGeneric,
  ImpressionProduct,
  LocationDirections,
  Product,
  ProductAction,
  Promotion,
  RootGeneric,
  Screenview,
  SearchGeneric,
  Transaction,
  TransactionAction,
  TransactionRefund
} from '../AnalyticsProvider';

const eventMap: { [s: string]: string } = {
  Cart: 'basket',
  Category: 'category',
  Checkout: 'checkout',
  ProductDetail: 'product',
  Shop: 'home',
  Wishlist: 'wishlist'
};

import AnalyticsProviderConfiguration from '../types/AnalyticsProviderConfiguration';

export interface EpiserverAnalyticsProviderConfiguration {
  baseURL?: string;
  language?: string;
  marketId?: string;
  scope?: string;
  trackPath?: string;
  useReferrer?: boolean;
}

export default class EpiserverAnalyticsProvider extends AnalyticsProvider {
  client: FSNetwork;
  language?: string;
  marketId?: string;
  useReferrer: boolean;
  scope?: string;
  trackPath: string;
  previousURL?: string;
  screenProduct?: Product;

  constructor(commonConfiguration: AnalyticsProviderConfiguration,
              configuration: EpiserverAnalyticsProviderConfiguration) {
    super(commonConfiguration);

    this.client = new FSNetwork({
      baseURL: configuration.baseURL || ''
    });
    this.language = configuration.language;
    this.marketId = configuration.marketId;
    this.scope = configuration.scope;
    this.trackPath = configuration.trackPath || '/episerverapi/commercetracking/track';
    this.useReferrer = configuration.useReferrer || false;
  }

  // Commerce Functions

  contactCall(properties: ContactCall): void {
    // Not supported
  }

  contactEmail(properties: ContactEmail): void {
    // Not supported
  }

  clickGeneric(properties: ClickGeneric): void {
    // Not supported
  }

  impressionGeneric(properties: ImpressionGeneric): void {
    // Not supported
  }

  locationDirections(properties: LocationDirections): void {
    // Not supported
  }

  pageview(properties: Screenview): void {
    this.screenview(properties);
  }

  screenview(properties: Screenview): void {
    if (properties.eventCategory === 'unknown') {
      return;
    }
    const trackingObj: any = this._buildScreenView(properties);
    if (trackingObj.type === 'product' && this.screenProduct) {
      trackingObj.productCode = this.screenProduct.identifier;
      trackingObj.productName = this.screenProduct.name;
      this.screenProduct = undefined;
    }
    if (trackingObj.type === 'basket') {
      trackingObj.skipRecommendations = true;
    }
    this.client.post(this.trackPath, trackingObj);
  }

  categoryView(properties: RootGeneric, name: string): void {
    const trackingObj: any = this._buildScreenView(properties);
    trackingObj.type = 'category';
    trackingObj.category = name;
    this.client.post(this.trackPath, trackingObj);
  }

  trackBrand(properties: RootGeneric, name: string): void {
    const trackingObj: any = this._buildScreenView(properties);
    trackingObj.type = 'brand';
    trackingObj.brand = name;
    this.client.post(this.trackPath, trackingObj);
  }

  trackAttribute(properties: RootGeneric, name: string, value: string): void {
    const trackingObj: any = this._buildScreenView(properties);
    trackingObj.type = 'attribute';
    trackingObj.attribute = {
      name,
      value
    };
    this.client.post(this.trackPath, trackingObj);
  }

  searchGeneric(properties: SearchGeneric): void {
    const trackingObj: any = this._buildScreenView({
      eventCategory: 'searchresults',
      ...properties
    });
    trackingObj.searchResults = {
      term: properties.term,
      totalNumberOfResults: properties.count,
      productCodes: properties.productList && properties.productList.map((product: Product) => {
        return product.identifier;
      })
    };
    this.client.post(this.trackPath, trackingObj);
  }

  // Enhanced Commerce Functions

  addProduct(properties: Product): void {
    // Not supported
  }

  checkout(properties: Checkout, action: CheckoutAction): void {
    // Not supported
  }

  checkoutOption(properties: Generics, action: CheckoutAction): void {
    // Not supported
  }

  clickProduct(properties: Product, action?: ProductAction): void {
    // Not supported
  }

  clickPromotion(properties: Promotion): void {
    // Not supported
  }

  impressionProduct(properties: ImpressionProduct): void {
    // Not supported
  }

  impressionPromotion(properties: Promotion): void {
    // Not supported
  }

  detailProduct(properties: Product, action?: ProductAction): void {
    this.screenProduct = properties;
  }

  purchase(properties: Transaction, action: TransactionAction): void {
    const trackingObj: any = this._buildScreenView({
      eventCategory: 'order',
      ...properties
    });
    trackingObj.orderId = action.identifier;
    this.client.post(this.trackPath, trackingObj);
  }

  refundAll(properties: Generics, action: TransactionAction): void {
    // Not supported
  }

  refundPartial(properties: TransactionRefund, action: TransactionAction): void {
    // Not supported
  }

  removeProduct(properties: Product): void {
    // Not supported
  }

  // App Lifecycle Functions

  lifecycle(properties: App): void {
    // Not supported
  }

  private _buildScreenView(properties: RootGeneric): any {
    if (this.useReferrer && typeof document !== 'undefined') {
      this.previousURL = document.referrer;
    }
    const currentURL = properties.url ||
      (typeof window.location !== 'undefined' ? window.location.href : '');
    const trackingObj = {
      type: eventMap[properties.eventCategory] || properties.eventCategory,
      currentUri: currentURL,
      previousUri: this.previousURL,
      customAttributes: {
        marketId: this.marketId
      },
      scope: this.scope || null,
      lang: this.language
    };
    this.previousURL = currentURL;
    return trackingObj;
  }
}
