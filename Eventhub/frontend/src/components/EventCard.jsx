import React from 'react';

// Reusable EventCard component
// Props: title, category, date, venue, ticketsAvailable, onBook
const EventCard = ({ title, category, date, venue, ticketsAvailable, onBook }) => {
  // Simple conditional check at top as hinted
  const isSoldOut = ticketsAvailable === 0;

  return (
    <div className="event-card">
      <div className="event-card-header">
        <span className="event-category-badge">{category}</span>
        <span className={`event-availability ${isSoldOut ? 'sold-out' : 'available'}`}>
          {isSoldOut ? '0 Tickets Left' : `${ticketsAvailable} left`}
        </span>
      </div>

      <h3 className="event-title">{title}</h3>

      <div className="event-details">
        <p className="event-detail-item">
          <strong>Category:</strong> {category}
        </p>
        <p className="event-detail-item">
          <strong>Date:</strong> {new Date(date).toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </p>
        <p className="event-detail-item">
          <strong>Venue:</strong> {venue}
        </p>
        <p className="event-detail-item">
          <strong>Tickets Available:</strong> {ticketsAvailable}
        </p>
      </div>

      <div className="event-card-footer">
        {/* If ticketsAvailable is 0, render a "Sold Out" badge instead of a "Book" button */}
        {isSoldOut ? (
          <span className="badge-sold-out">Sold Out</span>
        ) : (
          <button className="btn-book" onClick={onBook}>
            Book
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
