
export const environment = {
  production: false,
  RUN_ENVIRONMENT: 'dev',
  COUNTRY: 'US',
  config: {
    apiKey: "AIzaSyCEVHnj_VE5v0v2FLRx5c33Xz7h34WWDr8",
    authDomain: "girlsonboard-8709f.firebaseapp.com",
    databaseURL: "https://girlsonboard-8709f.firebaseio.com",
    projectId: "girlsonboard-8709f",
    storageBucket: "girlsonboard-8709f.appspot.com",
    messagingSenderId: "188463375813",
    appId: "1:188463375813:web:7b2f1291a902bae73917ac",
    measurementId: "G-CX3VKY8ZWV"
  },
  API_URLS: {
    dev: 'http://192.168.1.2:3000',
    prod: ''
  },
  MAIN_MENU_ITEMS: [
    {
      title: 'Book Ride',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Driver Profile',
      url: '/driver-profile',
      icon: 'person'
    },
    {
      title: 'History',
      url: '/history',
      icon: 'timer'
    },
    {
      title: 'About Us',
      url: '/aboutus',
      icon: 'information'
    },
    {
      title: 'Feedback',
      url: '/feedback',
      icon: 'newspaper'
    },
    {
      title: 'Emergency',
      url: '/emergency',
      icon: 'warning'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'cog'
    }

  ],
  HELP_FAQS: [
    { title: 'Report an issue with your last trip' },
    { title: 'Trip and Fare review' },
    { title: 'Account and Payment options' },
    { title: 'A Guide to Ion Taxi' },
    { title: 'Accessibility' }
  ],
  GOOGLE_MAPS_API_KEY: "AIzaSyCEVHnj_VE5v0v2FLRx5c33Xz7h34WWDr8",
  IONIC_STORAGE: 'userdb',
  DRIVER_DELAY_MSG: 'Driver is taking longer than usual! please try again later',
  DRIVER_REJECTED_MSG: 'Driver rejected your booking',
  LOGOUT_CONFIRMATION: 'Are you sure you want to logout?',
  MARKER_OPTIONS: {
    origin: {
      animation: '\'DROP\'',
      label: 'origin',
      draggable: true

    },
    destination: {
      animation: '\'DROP\'',
      label: 'destination',
      draggable: true

    },
  },
  RENDER_OPTIONS: {
    suppressMarkers: true,
  },
  SELECT_DESTINATION_WARN: 'You must select destination location first to request ride',
  SELECT_ORIGIN_WARN: 'You must select origin location first to request ride',
  SCREEN_OPTIONS: {},
  COUNTRY_DIAL_CODES: [
    {
      name: 'Brunei Darussalam',
      dialCode: '+673',
      code: 'BN'
    },
    {
      name: 'Indonesia',
      dialCode: '+62',
      code: 'ID'
    },
    {
      name: 'Korea, Democratic People\'s Republic of Korea',
      dialCode: '+850',
      code: 'KP'
    },
    {
      name: 'Korea, Republic of South Korea',
      dialCode: '+82',
      code: 'KR'
    },
    {
      name: 'Malaysia',
      dialCode: '+60',
      code: 'MY'
    },
    {
      name: 'Singapore',
      dialCode: '+65',
      code: 'SG'
    },
    {
      name: 'Thailand',
      dialCode: '+66',
      code: 'TH'
    },
    {
      name: 'United Kingdom',
      dialCode: '+44',
      code: 'GB'
    },
    {
      name: 'United States',
      dialCode: '+1',
      code: 'US'
    }
  ],
  USER_CONFIRM_MSG: 'Your driver will arrive shortly. Do you want to confirm booking?',
  RIDE_COMPLETED_MSG: 'Your ride is completed. Please pay the Fare.',
  USER_CANCEL_MSG: 'Do you want to cancel this ride ? Driver is already on his way',
  MAP_STYLE: [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#f5f5f5'
        }
      ]
    },
    {
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#616161'
        }
      ]
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#f5f5f5'
        }
      ]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#bdbdbd'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          color: '#eeeeee'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#757575'
        }
      ]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [
        {
          color: '#e5e5e5'
        }
      ]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9e9e9e'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#ffffff'
        }
      ]
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#757575'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dadada'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#616161'
        }
      ]
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9e9e9e'
        }
      ]
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [
        {
          color: '#e5e5e5'
        }
      ]
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [
        {
          color: '#eeeeee'
        }
      ]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#c9c9c9'
        }
      ]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9e9e9e'
        }
      ]
    }
  ],

};

