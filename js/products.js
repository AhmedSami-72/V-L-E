'use strict';

(function () {
  var Data = window.Volee && window.Volee.Data;
  var UI = window.Volee && window.Volee.UI;

  if (!Data || !UI) {
    return;
  }

  var products = Data.products;
  var formatPrice = Data.formatPrice;
  var contactConfig = Data.contactConfig;
  var productCardTemplate = UI.productCardTemplate;
  var initCommonUI = UI.initCommonUI;
  var observeReveals = UI.observeReveals;

  function renderAllProducts() {
    var container = document.getElementById('products-full-grid');
    if (!container) return;

    var html = '';
    for (var i = 0; i < products.length; i++) {
      html += productCardTemplate(products[i], formatPrice);
    }
    container.innerHTML = html;

    var countNum = document.getElementById('collection-count-num');
    if (countNum) countNum.textContent = products.length.toString();
  }

  function boot() {
    renderAllProducts();

    initCommonUI({
      products: products,
      contactConfig: contactConfig,
      formatPrice: formatPrice,
      heroProduct: null,
      editorialProduct: null,
      isLanding: false
    });

    if (observeReveals) observeReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
