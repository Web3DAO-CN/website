import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
// import {
//   faCoffee,
//   faCog,
//   faSpinner,
//   faQuoteLeft,
//   faSquare,
//   faCheckSquare
// } from '@fortawesome/free-solid-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
//

export default function initFontawesome() {
  library.add(
    fas,
    far,
    fab
  )
}
