'use strict';

(function () {
  var Data = window.Volee && window.Volee.Data;
  var UI = window.Volee && window.Volee.UI;

  if (!Data || !UI) {
    return;
  }

  var products = Data.products;
  var formatPrice = Data.formatPrice;
  var getFeaturedProducts = Data.getFeaturedProducts;
  var heroProduct = Data.heroProduct;
  var contactConfig = Data.contactConfig;
  var productCardTemplate = UI.productCardTemplate;
  var initCommonUI = UI.initCommonUI;
  var observeReveals = UI.observeReveals;

  function renderFeaturedProduct() {
    var container = document.getElementById('featured-product-container');
    if (!container) return;

    var featuredList = getFeaturedProducts();
    var product = heroProduct || (featuredList && featuredList[0]) || products[0];
    if (!product) return;

    var oldPriceHtml = product.oldPrice
      ? '<span class="product-old-price">' + formatPrice(product.oldPrice) + '</span>'
      : '';

    var descParts = [];
    if (product.quality) descParts.push(product.quality);
    if (product.description) descParts.push(product.description);
    var descText = descParts.join(' — ');

    container.innerHTML =
      '<div class="featured-product-inner">' +
        '<div class="featured-product-media reveal-item" data-action="quick-view" data-id="' + product.id + '">' +
          '<img src="' + product.image + '" alt="' + product.name + '" class="featured-product-img" loading="eager" referrerpolicy="no-referrer" />' +
          '<div class="product-hover-cue"><span>اكتشفي التفاصيل</span></div>' +
        '</div>' +
        '<div class="featured-product-info reveal-item">' +
          '<span class="product-brand-tag">' + (product.badge || 'VÖLÉE') + '</span>' +
          '<h3 class="featured-product-title" data-action="quick-view" data-id="' + product.id + '">' + product.name + '</h3>' +
          '<div class="featured-product-price-row">' +
            '<span class="product-current-price">' + formatPrice(product.price) + '</span>' +
            oldPriceHtml +
          '</div>' +
          '<p class="featured-product-desc">' + descText + '</p>' +
          '<div class="featured-product-actions">' +
            '<button class="btn-primary" data-action="quick-view" data-id="' + product.id + '">اكتشفي التفاصيل</button>' +
            '<a href="' + contactConfig.instagram + '" target="_blank" rel="noopener noreferrer" class="btn-secondary">تواصلي عبر إنستجرام</a>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderCuratedCollection() {
    var container = document.getElementById('curated-collection-grid');
    if (!container) return;

    var curatedIds = [29, 27, 17, 36, 13, 32];
    var items = [];
    for (var i = 0; i < curatedIds.length; i++) {
      var found = null;
      for (var j = 0; j < products.length; j++) {
        if (products[j].id === curatedIds[i]) { found = products[j]; break; }
      }
      if (found) items.push(found);
    }

    var curatedItems;
    if (items.length === curatedIds.length) {
      curatedItems = items;
    } else {
      var featured = getFeaturedProducts();
      curatedItems = featured.slice(0, 6);
    }

    var html = '';
    for (var k = 0; k < curatedItems.length; k++) {
      html += productCardTemplate(curatedItems[k], formatPrice);
    }
    container.innerHTML = html;
  }

  function renderMoreProducts() {
    var container = document.getElementById('more-products-grid');
    if (!container) return;

    var moreIds = [7, 51, 52, 44];
    var items = [];
    for (var i = 0; i < moreIds.length; i++) {
      var found = null;
      for (var j = 0; j < products.length; j++) {
        if (products[j].id === moreIds[i]) { found = products[j]; break; }
      }
      if (found) items.push(found);
    }

    var moreItems;
    if (items.length === moreIds.length) {
      moreItems = items;
    } else {
      var nonFeatured = [];
      for (var k = 0; k < products.length; k++) {
        if (!products[k].featured) nonFeatured.push(products[k]);
      }
      moreItems = nonFeatured.slice(0, 4);
    }

    var html = '';
    for (var m = 0; m < moreItems.length; m++) {
      html += productCardTemplate(moreItems[m], formatPrice);
    }
    container.innerHTML = html;
  }

  function boot() {
    renderFeaturedProduct();
    renderCuratedCollection();
    renderMoreProducts();

    initCommonUI({
      products: products,
      contactConfig: contactConfig,
      formatPrice: formatPrice,
      heroProduct: Data.heroProduct,
      editorialProduct: Data.editorialProduct,
      isLanding: true
    });

    if (observeReveals) observeReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
