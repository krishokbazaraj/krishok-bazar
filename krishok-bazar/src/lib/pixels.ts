// Client-side Analytics Pixels Helper (Meta Pixel + TikTok Pixel)

export function initPixels() {
  const META_PIXEL_ID = "806147635774057";
  const TIKTOK_PIXEL_ID = "D7F1SV3C77UB0P2498P0";

  if (typeof window === 'undefined') return;

  const win = window as any;

  // Detect sandbox, developer preview url, local development, or iframe nesting
  const isPreview = 
    win.location.hostname.includes('run.app') || 
    win.location.hostname.includes('localhost') || 
    win.location.hostname.includes('127.0.0.1') ||
    (win.self !== win.top);

  if (isPreview) {
    console.log('🤖 Platform Preview / Local Sandbox Detected. Initializing mock Analytics Pixels to prevent third-party tracker blockages.');
    // Mock Meta Pixel
    if (!win.fbq) {
      win.fbq = function(...args: any[]) {
        console.log('📊 [Mock Meta Pixel Event]:', ...args);
      };
      win.fbq.loaded = true;
      win.fbq.version = '2.0-mocked';
    }
    // Mock TikTok Pixel
    if (!win.ttq) {
      win.ttq = {
        page: () => console.log('📊 [Mock TikTok PageView]'),
        track: (event: string, data?: any) => console.log(`📊 [Mock TikTok Event - ${event}]:`, data),
        load: () => {},
        methods: [],
        setAndTrack: () => {},
        instance: () => ({})
      };
    }
    return;
  }

  // 1. Initialize Real Meta Pixel for production Custom Domain environment
  try {
    if (!win.fbq) {
      win.fbq = function() {
        win.fbq.callMethod ? win.fbq.callMethod.apply(win, arguments) : win.fbq.queue.push(arguments);
      };
      if (!win._fbq) win._fbq = win.fbq;
      win.fbq.push = win.fbq;
      win.fbq.loaded = true;
      win.fbq.version = '2.0';
      win.fbq.queue = [];
      
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      // Inline error catching for script loading
      script.onerror = (e) => {
        console.warn('Meta Pixel script load blocked/failed. Swallowing error to avoid runtime issues.', e);
      };
      
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    }
    win.fbq('init', META_PIXEL_ID);
    win.fbq('track', 'PageView');
    console.log('✓ Meta Pixel Loaded:', META_PIXEL_ID);
  } catch (err) {
    console.warn('Meta Pixel init failed:', err);
  }

  // 2. Initialize Real TikTok Pixel for production Custom Domain environment
  try {
    const doc = document;
    if (!win.ttq) {
      const ttq = (win.ttq = []) as any;
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "trackWithSegment", "setAndTrack", "instance"];
      ttq.setAndTrack = function (format: any, event: any, data: any) {
        ttq.trackWithSegment(format, event, data);
      };
      ttq.instance = function (name: any) {
        const instance = ttq._i[name] || [];
        return instance;
      };
      ttq.load = function (e: any, t: any) {
        const n = "https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i = ttq._i || {};
        ttq._i[e] = [];
        ttq._i[e]._u = n;
        ttq._t = ttq._t || {};
        ttq._t[e] = +new Date();
        ttq._o = ttq._o || {};
        ttq._o[e] = t || {};
        
        const a = doc.createElement("script");
        a.type = "text/javascript";
        a.async = true;
        a.src = n;
        // Inline error catching for script loading
        a.onerror = (err) => {
          console.warn('TikTok Pixel script load blocked/failed. Swallowing error to avoid runtime issues.', err);
        };
        
        const i = doc.getElementsByTagName("script")[0];
        if (i && i.parentNode) {
          i.parentNode.insertBefore(a, i);
        } else {
          doc.head.appendChild(a);
        }
      };
      ttq.load(TIKTOK_PIXEL_ID);
      ttq.page();
      console.log('✓ TikTok Pixel Loaded:', TIKTOK_PIXEL_ID);
    }
  } catch (err) {
    console.warn('TikTok Pixel init failed:', err);
  }
}

// Global Custom Event Triggers
export function trackPageView() {
  try {
    const win = window as any;
    if (win.fbq) win.fbq('track', 'PageView');
    if (win.ttq) win.ttq.page();
  } catch (e) {}
}

export function trackAddToCart(itemTitle: string, price: number, quantity: number) {
  try {
    const win = window as any;
    const itemData = {
      content_name: itemTitle,
      value: price * quantity,
      currency: 'BDT',
      quantity: quantity
    };
    if (win.fbq) win.fbq('track', 'AddToCart', itemData);
    if (win.ttq) win.ttq.track('AddToCart', itemData);
    console.log('Pixel Event: AddToCart', itemData);
  } catch (e) {}
}

export function trackInitiateCheckout(total: number) {
  try {
    const win = window as any;
    const checkoutData = {
      value: total,
      currency: 'BDT'
    };
    if (win.fbq) win.fbq('track', 'InitiateCheckout', checkoutData);
    if (win.ttq) win.ttq.track('InitiateCheckout', checkoutData);
    console.log('Pixel Event: InitiateCheckout', checkoutData);
  } catch (e) {}
}

export function trackPurchase(orderId: string, total: number) {
  try {
    const win = window as any;
    const purchaseData = {
      content_ids: [orderId],
      value: total,
      currency: 'BDT'
    };
    if (win.fbq) win.fbq('track', 'Purchase', purchaseData);
    if (win.ttq) win.ttq.track('CompletePayment', purchaseData);
    console.log('Pixel Event: Purchase', purchaseData);
  } catch (e) {}
}

export function trackSearch(query: string) {
  try {
    const win = window as any;
    if (win.fbq) win.fbq('track', 'Search', { search_string: query });
    if (win.ttq) win.ttq.track('Search', { query });
    console.log('Pixel Event: Search', query);
  } catch (e) {}
}
