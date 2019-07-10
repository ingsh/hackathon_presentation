class MbVehicle extends HTMLElement {
  // Element constructor
  constructor () {
    super()

    // Init shadow DOM
    this._shadowRoot = this.attachShadow({ mode: 'open' })
  }

  // Use properties to work with the name attribute
  get id () {
    return this.getAttribute('id')
  }
  set id (newId) {
    if (newId) this.setAttribute('id', newId)
    else this.removeAttribute('id')
  }

  // The name attribute must be observed to react to changes
  static get observedAttributes () {
    return ['id']
  }
  // React to these changes
  attributeChangedCallback (attrName, oldVal, newVal) {
    switch (attrName) {
      case 'id':
        if (this._shadowRoot) this.render()
        break
    }
  }

  // Fires when component is mounted
  connectedCallback () {
    this.render()
  }

  async getVehicle(id) {
    let response = await fetch('https://5c8fbd728447f30014cb832f.mockapi.io/vehicle/' + id)
    return response.json()
  }

  // Render the component
  async render () {
    if (!this.id) return ''

    let vehicle = await this.getVehicle(this.id)

    const formatter = new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2
    })
    let formattedPrice = formatter.format(vehicle.price)

    this._shadowRoot.innerHTML = `
    <style>
        @font-face {
            font-family: DaimlerCS-Light;
            font-display: swap;
            font-weight: 300;
            src: url(https://assets.oneweb.mercedes-benz.com/global/1.16.0/fonts/EOT/DaimlerCS-Light.eot);
            src: url(https://assets.oneweb.mercedes-benz.com/global/1.16.0/fonts/EOT/DaimlerCS-Light.eot#iefix) format("embedded-opentype"), url(https://assets.oneweb.mercedes-benz.com/global/1.16.0/fonts/WOFF2/DaimlerCS-Light.woff2) format("woff2"), url(https://assets.oneweb.mercedes-benz.com/global/1.16.0/fonts/WOFF/DaimlerCS-Light.woff) format("woff"), url(https://assets.oneweb.mercedes-benz.com/global/1.16.0/fonts/TTF/DaimlerCS-Light.ttf) format("truetype"), url(https://assets.oneweb.mercedes-benz.com/global/1.16.0/fonts/SVG/DaimlerCS-Light.svg#DaimlerCS-Light) format("svg")
        }

        @font-face {
            font-family: DaimlerCAC-Regular;
            font-display: swap;
            src: url(https://assets.oneweb.mercedes-benz.com/global/1.16.0/fonts/EOT/DaimlerCAC-Regular.eot);
            src: url(https://assets.oneweb.mercedes-benz.com/global/1.16.0/fonts/EOT/DaimlerCAC-Regular.eot#iefix) format("embedded-opentype"), url(https://assets.oneweb.mercedes-benz.com/global/1.16.0/fonts/WOFF2/DaimlerCAC-Regular.woff2) format("woff2"), url(https://assets.oneweb.mercedes-benz.com/global/1.16.0/fonts/WOFF/DaimlerCAC-Regular.woff) format("woff"), url(https://assets.oneweb.mercedes-benz.com/global/1.16.0/fonts/TTF/DaimlerCAC-Regular.ttf) format("truetype"), url(https://assets.oneweb.mercedes-benz.com/global/1.16.0/fonts/SVG/DaimlerCAC-Regular.svg#DaimlerCAC-Regular) format("svg")
        }

        .mb-vehicle {
            box-shadow: 0 0 4px 0 rgba(0, 0, 0, .1);
            width: 20em;
            background-color: white;
            border-radius: 1px;
            overflow: hidden;
            text-align:left;
        }

        .mb-vehicle__image {
            width: 100%;
            display: block;
        }

        .mb-vehicle__data {
            padding: 1em;
        }

        .mb-vehicle__class, .mb-vehicle__body-group, .mb-vehicle__price {
            margin: 0;
            padding: 0;
        }

        .mb-vehicle__class {
            font-family: DaimlerCAC-Regular, serif;
            font-weight: 400;
            color: #333
        }

        .mb-vehicle__body-group, .mb-vehicle__price {
            color: #666;
            font-family: DaimlerCS-Light, sans-serif;
            font-weight: 300;
        }

        .mb-vehicle__price {
            margin-top: 1em
        }
    </style>
    <div class="mb-vehicle">
      <img src="${vehicle.image}" alt="" class="mb-vehicle__image">
      <div class="mb-vehicle__data">
        <h1 class="mb-vehicle__class">
          ${vehicle.class}
        </h1>
        <p class="mb-vehicle__body-group">
          ${vehicle.bodyGroup}
        </p>
        <p class="mb-vehicle__price">
          A partir de ${formattedPrice}
        </p>
      </div>
    </div>
    `
  }
}

customElements.define('mb-vehicle', MbVehicle)
