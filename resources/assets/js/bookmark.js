import { LuminousGallery } from 'luminous-lightbox';

if (document.querySelector('.lightbox')) {
  new LuminousGallery(document.querySelectorAll('.lightbox'), {
    arrowNavigation: false
  }, {
    caption: function (el) {
      return el.getAttribute('alt')
    }
  });
}
