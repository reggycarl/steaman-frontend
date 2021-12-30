import Link from 'next/link'
import React, { Component } from 'react'

export default class NotFound extends Component {
    render() {
        return (
            <>
    <h1>404 - Page Not Found</h1>
    <Link href="/">
      <a>
        Go back home
      </a>
    </Link>
  </>
        )
    }
}
