import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";

const DEPARTMENTS = [1, 2, 3, 4, 5, 6];
const STORAGE_KEY = "portero_department";

export const ResidentSelectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const dept = parseInt(saved, 10);
      if (dept >= 1 && dept <= 6) {
        navigate(`/resident/${dept}`, { replace: true });
      }
    }
  }, [navigate]);

  const handleSelect = (dept: number) => {
    localStorage.setItem(STORAGE_KEY, String(dept));
    navigate(`/resident/${dept}`);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Panel Residente</h1>
        <p>Selecciona tu departamento</p>
      </div>

      <div className="messages-container portero-container">
        <div className="departments-grid">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              className="department-button"
              onClick={() => handleSelect(dept)}
            >
              <span>🏠</span>
              Depto {dept}
            </button>
          ))}
        </div>
        <p className="resident-link-hint">
          ¿Eres portero?{" "}
          <a href="/portero" className="link-portero">
            Ir a panel portero
          </a>
        </p>
      </div>
    </div>
  );
};
