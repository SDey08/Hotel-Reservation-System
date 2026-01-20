import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import logo from './logo.png';
import RoomSection from './RoomSection.jsx';
import Search from './Search.jsx';
import Navbar from './Navbar';
import HotelSection from './HotelSection.jsx';
const Home = () => {
  const images = [
    { src: 'https://media.cnn.com/api/v1/images/stellar/prod/190122174726-05-best-airport-lounges-emirates.jpg?q=w_4256,h_2394,x_0,y_0,c_fill', text: 'Comfort' },
    { src: 'https://gos3.ibcdn.com/4dcb3bcd-240b-48f8-a706-7506f0029021.jpg', text: 'Ambience' },
    { src: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/195485899.webp?k=cfd57d7de6e0858d7e10a899025dfdecc09973d741092cd7b8ca6de1b1ec722d&o=', text: 'Luxury' },
    { src: 'https://images.trvl-media.com/lodging/103000000/102400000/102396700/102396631/b21c0b9e.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill', text: 'Hospitality' },
    { src: 'https://images.trvl-media.com/lodging/103000000/102400000/102396700/102396631/c472723b.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill', text: 'and Many More...' }
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
  };

  const slideStyle = {
    position: 'relative',
    height: '500px',
    overflow: 'hidden',
  };

  const imgStyle = {
    width: '100%',
    height: '500px',
    objectFit: 'cover',
    filter: 'brightness(70%)'
  };

  const overlayText = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '3rem',
    fontWeight: 'bold',
    textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
    textAlign: 'center'
  };

  const titleContainer = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '20px',
    marginBottom: '5px'
  };

  const titleStyle = {
    fontSize: '4rem',
    fontFamily: '"Arizonia", cursive',
    color: '#2c1810',
    margin: 0 
  };
  
  const subtitleStyle = {
    textAlign: 'center',
    fontSize: '1.3rem',
    fontFamily: '"Roboto", sans-serif',
    color: '#4a4a4a',
    marginTop: '5px', 
    marginBottom: '30px',
    padding: '0 20px',
    fontStyle: 'italic'
  };
  
  return (
    <div>
      <Navbar/>
      <Slider {...settings}>
        {images.map((slide, index) => (
          <div key={index}>
            <div style={slideStyle}>
              <img src={slide.src} alt={slide.text} style={imgStyle} />
              <div style={overlayText}>{slide.text}</div>
            </div>
          </div>
        ))}
      </Slider>


      <div style={titleContainer}>
        <img src={logo} alt="The Bengal Roots Logo" style={{ height: '85px' }} />
        <h1 style={titleStyle}>The Bengal Roots</h1>
      </div>

      <p style={subtitleStyle}>
        Where <strong>আতিথেয়তা</strong> (hospitality) of Bengal reaches every heart across India.
      </p>

      <Search/>
      <HotelSection/>
      <RoomSection/>
    </div>
  );
};

export default Home;
