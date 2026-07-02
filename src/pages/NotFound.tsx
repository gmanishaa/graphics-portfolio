import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>That page doesn't exist.</p>
      <Link to="/">← Back home</Link>
    </div>
  )
}

export default NotFound
