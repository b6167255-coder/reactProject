import { useNavigate } from 'react-router-dom';
import '../css/NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p className="error-message">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="error-submessage">
          It might have been moved or deleted.
        </p>
        
        <div className="not-found-actions">
          <button onClick={handleGoBack} className="back-button">
            ← Go Back
          </button>
          <button onClick={handleGoHome} className="home-button">
            🏠 Go to Dashboard
          </button>
        </div>

        <div className="not-found-illustration">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="80" fill="#f0f0f0" />
            <circle cx="75" cy="85" r="10" fill="#667eea" />
            <circle cx="125" cy="85" r="10" fill="#667eea" />
            <path
              d="M70 130 Q100 110 130 130"
              stroke="#667eea"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;