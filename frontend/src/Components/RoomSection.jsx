import React from 'react';

const roomTypes = [
  {
    name: 'SINGLE',
    img: 'https://www.hotelmonterey.co.jp/upload_file/monhtyo/stay/sng_600_001.jpg',
    description: 'A cozy room designed for one person with a comfortable bed and workspace.',
    services: ['Free Wi-Fi', 'Complimentary Breakfast', 'Work Desk', 'Air Conditioning'],
  },
  {
    name: 'DOUBLE',
    img: 'https://images.unsplash.com/photo-1512918580421-b2feee3b85a6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2luZ2xlJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    description: 'Spacious room suitable for two guests, featuring twin beds and modern amenities.',
    services: ['Free Wi-Fi', 'Complimentary Breakfast', 'Flat-screen TV', 'Room Service'],
  },
  {
    name: 'SUITE',
    img: 'https://www.area83.in/ElementImages/b3178af5-8844-435f-a3f3-398c479231a0_rgallery.jpeg',
    description: 'Luxurious suite with separate living area, ideal for a premium stay experience.',
    services: ['Butler Service', 'Mini-bar', '24/7 Room Service', 'Private Balcony'],
  },
  {
    name: 'DELUXE',
    img: 'https://thumbs.dreamstime.com/b/original-creative-design-beige-cave-style-bedroom-swimming-pool-beautiful-ceiling-lighting-minimalistic-gorgeous-ai-322299541.jpg',
    description: 'Elegant deluxe room with king-size bed and high-end furnishings.',
    services: ['Butler Service', 'Private Pool and Balcony', 'Personalized Concierge', 'Spa Access'],
  },
];

const RoomsSection = () => {
  return (
    <section className="rooms-section">
      <h1 style={{ color: "#171717", marginBottom: "30px", textAlign: "center", fontSize: "34px"}}>Explore Our Rooms</h1>

      <div className="rooms-grid">
        {roomTypes.map(({ name, img, description, services }) => (
          <div key={name} className="room-card">
            <img src={img} alt={`${name} room`} className="room-img" />
            <div className="room-content">
              <h3 className="room-name">{name}</h3>
              <p className="room-desc">
                <strong>Description:</strong> {description}
              </p>
              <p className="services-title"><strong>Services Available:</strong></p>
              <ul className="services-list">
                {services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .rooms-section {
          max-width: 1000px;
          margin: 3rem auto;
          padding: 0 1rem;
        }
        .rooms-section h2 {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2rem;
          color: #2c1810;
          font-weight: 600;
        }
        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }
        .room-card {
          background-color: white;
          color: black;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          cursor: default;
          display: flex;
          flex-direction: column;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .room-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        .room-content {
          padding: 1rem;
          flex-grow: 1;
        }
        .room-name {
          margin-top: 0;
          margin-bottom: 0.5rem;
          color: #2c1810;
          transition: color 0.3s ease;
        }
        .room-desc {
          font-style: italic;
          margin-bottom: 1rem;
          transition: color 0.3s ease;
        }
        .services-title {
          margin-bottom: 0.5rem;
          transition: color 0.3s ease;
        }
        .services-list {
          padding-left: 1.2rem;
          margin-top: 0;
          margin-bottom: 0;
          transition: color 0.3s ease;
        }
        .services-list li {
          transition: color 0.3s ease;
        }
        /* Hover styles */
        .room-card:hover {
          background-color: black;
          color: white;
        }
        .room-card:hover .room-name {
          color: #FFA700; /* yellow */
        }
        .room-card:hover .room-desc,
        .room-card:hover .services-title,
        .room-card:hover .services-list,
        .room-card:hover .services-list li {
          color: white;
        }
      `}</style>
    </section>
  );
};

export default RoomsSection;
