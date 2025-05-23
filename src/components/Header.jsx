import { Container } from 'react-bootstrap'

const Header = ({ head, description }) => {
  return (
    <div
      className="glassy-header-card text-center mx-auto mb-4"
      style={{
        maxWidth: 700,
        borderRadius: '1.5rem',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        padding: '2.5rem 2rem 2rem 2rem',
        marginTop: '2rem',
      }}
    >
      <h1
        style={{
          fontSize: '2.7rem',
          fontWeight: 800,
          letterSpacing: '0.01em',
          color: '#132a49',
          fontFamily: 'Comfortaa, cursive',
          marginBottom: '0.5rem',
        }}
      >
        {head}
      </h1>
      <div
        style={{
          fontSize: '1.25rem',
          color: '#3b82f6',
          fontWeight: 500,
          marginBottom: '0.5rem',
        }}
      >
        Chat with AI Personalities
      </div>
      {description && (
        <p className='lead text-capitalize' style={{ color: '#444', fontWeight: 400, marginTop: 8 }}>{description}</p>
      )}
    </div>
  )
}

export default Header
