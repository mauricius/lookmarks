import SlimSelect from 'slim-select'
require('slim-select/dist/slimselect.min.css')

if (document.querySelector('#categories')) {
  new SlimSelect({
    select: '#categories'
  })
}