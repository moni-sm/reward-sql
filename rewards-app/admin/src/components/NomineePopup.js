import React from 'react';
import './NomineePopup.css';

const NomineePopup = ({ nominee, onClose, onDelete, baseFilePath }) => (
  <div className="popup-overlay">
    <div className="popup-box">
      <button className="close-btn" onClick={onClose}>❌</button>

      <h2 className="popup-title">{nominee.name}</h2>

      {nominee.nominations.map((entry, i) => (
        <div key={i} className="nomination-card">
          <h3>Nomination #{i + 1}</h3>
          <p><strong>Nominator:</strong> {entry.nomName} ({entry.nomDesig})</p>
          <p><strong>Category:</strong> {entry.awardCategory}</p>
          <p><strong>Reason:</strong> {entry.reason1}</p>
          <p><strong>Impact:</strong> {entry.reason2}</p>

          {entry.supportingFile ? (
            <p>
              <strong>File:</strong> <a href={`${baseFilePath}${entry.supportingFile}`} target="_blank">📄 View</a>
            </p>
          ) : (
            <p><strong>File:</strong> None</p>
          )}

          <button className="delete-btn" onClick={() => onDelete(entry.id)}>🗑 Delete</button>
        </div>
      ))}
    </div>
  </div>
);

export default NomineePopup;
