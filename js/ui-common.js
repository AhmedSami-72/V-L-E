'use strict';

(function () {
  var revealObserver = null;
  var modalOverlayCache = null;

  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;
    var update = function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      header.classList.toggle('is-scrolled', y > 50);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initMobileNav() {
    var openBtn = document.getElementById('mobile-menu-open');
    var closeBtn = document.getElementById('mobile-menu-close');
    var drawer = document.getElementById('mobile-nav-drawer');
    var backdrop = document.getElementById('mobile-nav-backdrop');
    var navLinks = document.querySelectorAll('.mobile-nav-link');
    if (!drawer || !backdrop) return;

    var openDrawer = function () {
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };
    var closeDrawer = function () {
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    if (openBtn) openBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    navLinks.forEach(function (l) { l.addEventListener('click', closeDrawer); });
  }

  function initRevealObserver() {
    document.documentElement.classList.add('js');
    if (!('IntersectionObserver' in window)) return;
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px 40px 0px'
    });
    observeReveals();
  }

  function observeReveals() {
    if (!revealObserver) return;
    document.querySelectorAll('.reveal-item:not(.is-visible)').forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  function productCardTemplate(product, formatPrice) {
    return (
      '<article class="product-card reveal-item" data-id="' + product.id + '">' +
        '<div class="product-card-media" data-action="quick-view" data-id="' + product.id + '">' +
          '<img src="' + product.image + '" alt="' + product.name + '" class="product-card-img" loading="lazy" referrerpolicy="no-referrer" />' +
          '<div class="product-hover-cue"><span>اكتشفي التفاصيل</span></div>' +
        '</div>' +
        '<div class="product-card-content">' +
          '<h3 class="product-card-title" data-action="quick-view" data-id="' + product.id + '">' + product.name + '</h3>' +
          '<div class="product-card-price-row">' +
            '<span class="product-current-price">' + formatPrice(product.price) + '</span>' +
            (product.oldPrice ? '<span class="product-old-price">' + formatPrice(product.oldPrice) + '</span>' : '') +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function initFloatingContact(contactConfig) {
    if (!contactConfig) return;
    var igFloating = document.querySelector('.floating-btn-ig');
    var fbFloating = document.querySelector('.floating-btn-fb');
    if (igFloating) igFloating.href = contactConfig.instagram;
    if (fbFloating) fbFloating.href = contactConfig.facebook;

    var drawerIg = document.querySelector('.mobile-drawer-footer .btn-primary');
    var drawerFb = document.querySelector('.mobile-drawer-footer .btn-secondary');
    if (drawerIg) drawerIg.href = contactConfig.instagram;
    if (drawerFb) drawerFb.href = contactConfig.facebook;

    var headerIgIcon = document.querySelector('.header-actions .icon-btn[aria-label="Instagram"]');
    var headerFbIcon = document.querySelector('.header-actions .icon-btn[aria-label="Facebook"]');
    var headerIgCta = document.querySelector('.btn-header-cta');
    if (headerIgIcon) headerIgIcon.href = contactConfig.instagram;
    if (headerFbIcon) headerFbIcon.href = contactConfig.facebook;
    if (headerIgCta) headerIgCta.href = contactConfig.instagram;

    var footerIg = document.querySelector('.footer-social-links a:nth-child(1)');
    var footerFb = document.querySelector('.footer-social-links a:nth-child(3)');
    if (footerIg) footerIg.href = contactConfig.instagram;
    if (footerFb) footerFb.href = contactConfig.facebook;

    var finalIg = document.querySelector('.final-cta-section .btn-cta-instagram');
    var finalFb = document.querySelector('.final-cta-section .btn-cta-facebook');
    if (finalIg) finalIg.href = contactConfig.instagram;
    if (finalFb) finalFb.href = contactConfig.facebook;
  }

  function getModalOverlay() {
    if (modalOverlayCache) return modalOverlayCache;
    modalOverlayCache = document.getElementById('quickview-modal');
    return modalOverlayCache;
  }

  function openQuickView(productId, products, contactConfig, formatPrice) {
    var overlay = getModalOverlay();
    if (!overlay) return;
    var id = parseInt(productId, 10);
    var product = null;
    for (var i = 0; i < products.length; i++) {
      if (products[i].id === id) { product = products[i]; break; }
    }
    if (!product) return;

    var img = document.getElementById('modal-img');
    if (img) { img.src = product.image; img.alt = product.name; }

    var title = document.getElementById('modal-title');
    if (title) title.textContent = product.name;

    var badge = document.getElementById('modal-badge');
    if (badge) badge.textContent = product.badge || product.quality || 'VÖLÉE';

    var price = document.getElementById('modal-price');
    if (price) price.textContent = formatPrice(product.price);

    var oldPrice = document.getElementById('modal-oldprice');
    if (oldPrice) oldPrice.textContent = product.oldPrice ? formatPrice(product.oldPrice) : '';

    var desc = document.getElementById('modal-desc');
    if (desc) {
      var parts = [];
      if (product.quality) parts.push(product.quality);
      if (product.description) parts.push(product.description);
      desc.textContent = parts.length ? parts.join(' — ') : '';
    }

    var igBtn = document.getElementById('modal-ig-btn');
    var fbBtn = document.getElementById('modal-fb-btn');
    if (igBtn) igBtn.href = contactConfig.instagram;
    if (fbBtn) fbBtn.href = contactConfig.facebook;

    overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    var closeBtn = document.getElementById('modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeQuickView() {
    var overlay = getModalOverlay();
    if (!overlay) return;
    overlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function initQuickViewDelegation(products, contactConfig, formatPrice) {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-action="quick-view"]');
      if (trigger) {
        e.preventDefault();
        var id = trigger.getAttribute('data-id');
        if (id) openQuickView(id, products, contactConfig, formatPrice);
      }
    });
    var closeBtn = document.getElementById('modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeQuickView);
    var overlay = getModalOverlay();
    if (overlay) {
      overlay.addEventListener('click', function (e) { if (e.target === overlay) closeQuickView(); });
    }
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var ov = getModalOverlay();
        if (ov && ov.classList.contains('is-active')) closeQuickView();
      }
    });
  }

  function initHeroSequence() {
    var heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;
    requestAnimationFrame(function () { heroBg.classList.add('is-loaded'); });
  }

  function initEditorialParallax() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || window.innerWidth < 768) return;
    var el = document.querySelector('.editorial-banner-media img');
    if (!el) return;
    window.addEventListener('scroll', function () {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        var f = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        var shift = (f - 0.5) * 24;
        el.style.transform = 'scale(1.05) translateY(' + shift + 'px)';
      }
    }, { passive: true });
  }

  function injectHeroAndEditorialImages(heroProduct, editorialProduct) {
    if (heroProduct && heroProduct.image) {
      var heroImg = document.querySelector('.hero-bg img');
      if (heroImg) { heroImg.src = heroProduct.image; heroImg.alt = heroProduct.name; }
      var ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', heroProduct.image);
    }
    if (editorialProduct && editorialProduct.image) {
      var bannerImg = document.querySelector('.editorial-banner-media img');
      if (bannerImg) { bannerImg.src = editorialProduct.image; bannerImg.alt = editorialProduct.name; }
    }
  }

  function injectViewMoreCta(totalCount) {
    var section = document.getElementById('more-products');
    var grid = document.getElementById('more-products-grid');
    if (!section || !grid) return;
    if (document.getElementById('view-more-cta-wrap')) return;

    var wrap = document.createElement('div');
    wrap.id = 'view-more-cta-wrap';
    wrap.className = 'reveal-item';
    wrap.style.marginTop = 'clamp(2.5rem, 5vw, 4rem)';
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '0.75rem';
    wrap.style.textAlign = 'center';
    wrap.innerHTML =
      '<a href="./products.html" class="btn-primary">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="margin-inline-end: 0.35rem;">' +
          '<line x1="19" y1="12" x2="5" y2="12"></line>' +
          '<polyline points="12 19 5 12 12 5"></polyline>' +
        '</svg>' +
        'اكتشفي المجموعة كاملة' +
      '</a>' +
      '<p style="font-size: 0.875rem; color: var(--text-muted); margin: 0;">' +
        'جميع القطع المتوفرة — ' + (totalCount || 56) + ' منتج حقيقي من VÖLÉE' +
      '</p>';
    var container = section.querySelector('.container');
    if (container) container.appendChild(wrap);
  }

  function injectCuratedViewAllLink() {
    var section = document.getElementById('curated-collection');
    if (!section) return;
    var titleWrap = section.querySelector('.section-title-wrap');
    if (!titleWrap || titleWrap.querySelector('.curated-view-all')) return;
    titleWrap.style.display = 'flex';
    titleWrap.style.alignItems = 'baseline';
    titleWrap.style.justifyContent = 'space-between';
    titleWrap.style.flexWrap = 'wrap';
    titleWrap.style.gap = '1rem';
    var a = document.createElement('a');
    a.href = './products.html';
    a.className = 'curated-view-all';
    a.style.fontFamily = 'var(--font-arabic)';
    a.style.fontSize = '0.9rem';
    a.style.fontWeight = '600';
    a.style.color = 'var(--accent-taupe)';
    a.style.borderBottom = '1px solid currentColor';
    a.style.paddingBottom = '2px';
    a.textContent = 'عرض الكل →';
    titleWrap.appendChild(a);
  }

  function initCommonUI(opts) {
    var products = opts.products;
    var contactConfig = opts.contactConfig;
    var formatPrice = opts.formatPrice;
    var heroProduct = opts.heroProduct;
    var editorialProduct = opts.editorialProduct;
    var isLanding = opts.isLanding === true;

    if (isLanding) {
      injectHeroAndEditorialImages(heroProduct, editorialProduct);
    }
    initHeaderScroll();
    initMobileNav();
    initRevealObserver();
    initFloatingContact(contactConfig);
    initQuickViewDelegation(products, contactConfig, formatPrice);
    initHeroSequence();
    initEditorialParallax();
    if (isLanding) {
      injectViewMoreCta(products ? products.length : 56);
      injectCuratedViewAllLink();
    }
    observeReveals();
  }

  window.Volee = window.Volee || {};
  window.Volee.UI = {
    initHeaderScroll: initHeaderScroll,
    initMobileNav: initMobileNav,
    initRevealObserver: initRevealObserver,
    observeReveals: observeReveals,
    productCardTemplate: productCardTemplate,
    initFloatingContact: initFloatingContact,
    openQuickView: openQuickView,
    closeQuickView: closeQuickView,
    initQuickViewDelegation: initQuickViewDelegation,
    initHeroSequence: initHeroSequence,
    initEditorialParallax: initEditorialParallax,
    injectHeroAndEditorialImages: injectHeroAndEditorialImages,
    injectViewMoreCta: injectViewMoreCta,
    injectCuratedViewAllLink: injectCuratedViewAllLink,
    initCommonUI: initCommonUI
  };
})();
