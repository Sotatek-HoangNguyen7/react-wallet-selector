# react-wallet-selector

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/react-wallet-selector.svg)](https://www.npmjs.com/package/react-wallet-selector) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-wallet-selector
```

## Usage

```jsx
import React, { Component } from 'react'

import { SelectWalet, SendWalet, SignWalet } from 'react-wallet-selector'
import 'react-wallet-selector/dist/index.css'

class Example extends Component {
  render() {
    return (
      <div>
        <div className='container-fluid'>
          <div className='row mt-5'>
            <div className='col-4'>
              <SelectWalet />
            </div>
            <div className='col-4'>
              <SignWalet />
            </div>
            <div className='col-4'>
              <SendWalet />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
```

## License

MIT © [Sotatek-HoangNguyen7](https://github.com/Sotatek-HoangNguyen7)
