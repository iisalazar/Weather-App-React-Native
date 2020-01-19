import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

class App extends React.Component {
  state = {
    weatherData: {
         "coord": {
        "lon": 121.18,
        "lat": 14.17
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04d"
        }
      ],
      "base": "stations",
      "main": {
        "temp": 29.23,
        "feels_like": 33.29,
        "temp_min": 27.78,
        "temp_max": 31.11,
        "pressure": 1012,
        "humidity": 74
      },
      "visibility": 7000,
      "wind": {
        "speed": 2.6,
        "deg": 290
      },
      "clouds": {
        "all": 75
      },
      "dt": 1579324856,
      "sys": {
        "type": 1,
        "id": 8160,
        "country": "PH",
        "sunrise": 1579299805,
        "sunset": 1579340816
      },
      "timezone": 28800,
      "id": 1705539,
      "name": "Los Banos",
      "cod": 200
    },
    lastUpdated: Date.now(),
    deltaTime: 0,
    timerID: null
  }
  getWeatherIcon(name){
    return `http://openweathermap.org/img/w/${name}.png`
  }

  getWeatherData(){
    fetch('http://api.openweathermap.org/data/2.5/weather?id=1705539&units=metric&appid=d3ada73a1d1e423f3684ca601bb85355')
    .then( res => res.json())
    .then( resData => {
      this.setState({ weatherData: resData});
    })
    .catch(err => console.error(err));
  }

  updateData(){
    this.getWeatherData();
    this.setState({  lastUpdated: Date.now()  })
    this.startTimer();
  }

  updateDeltaTime(){
    const now = Date.now();
    const deltaTime = now - this.state.lastUpdated;
    const seconds = Math.round( deltaTime / 1000 );
    this.setState({ deltaTime: seconds });
  }
  
  startTimer(){
    if( this.state.timerID !== null ){
      this.stopTimer();
    }
    let timerID =  setInterval( () => this.updateDeltaTime(), 1000);
    this.setState({ timerID });
  }

  stopTimer() {
    if( this.state.timerID !== null ){
      clearInterval( this.state.timerID );
      this.setState({ deltaTime: 0 })
    }
  }

  componentDidMount() {
    this.getWeatherData();
    this.startTimer();
  }

  componenetWillUnmount() {
    this.stopTimer();
  }

  render() {
    return(
      <View style={styles.container}>
        <Text style={ styles.header }>Weather App</Text>
        <View style={ styles.card}>
          <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
            <Image
                source={ { uri: this.getWeatherIcon( this.state.weatherData.weather[0].icon ) } }
                style={ styles.weatherIcon }
              />
              
            <Text>
              Last Updated: { 
                this.state.deltaTime > 59 ? (
                  this.state.deltaTime > 3599 ? (
                    /* hours */
                    `${ Math.floor(this.state.deltaTime / 3600) } hour${ Math.floor(this.state.deltaTime / 3600) > 1 ? 's' : '' } ago.`
                  ) : (
                    /* minutes */
                    `${ Math.floor(this.state.deltaTime / 60) } minute${ Math.floor(this.state.deltaTime / 60) > 1 ? 's' : '' } ago.`
                  )
                ) : (
                  /* seconds */
                    `${ this.state.deltaTime } second${ Math.floor( this.state.deltaTime) > 1 ? 's' : ''  } ago.`
                )
              }
            </Text>
          </View>
          <View style={{ flex: 3, justifyContent: 'center' }}>
            <Text style={ styles.textLeft} >
              <Text style={ styles.subheader }>Location: </Text>
              <Text style={ styles.paragraph }>{ this.state.weatherData.name }</Text>
            </Text>
            <Text style={ styles.textLeft} >
              <Text style={ styles.subheader }>Weather: </Text>
              <Text style={ styles.paragraph }>{ this.state.weatherData.weather[0].main }</Text>
            </Text>
            <Text style={ styles.textLeft} >
              <Text style={ styles.subheader }>Description: </Text>
              <Text style={ styles.paragraph }>{ this.state.weatherData.weather[0].description }</Text>
            </Text>
            <Text style={ styles.textLeft} >
              <Text style={ styles.subheader }>Temperature: </Text>
              <Text style={ styles.paragraph }>
                { this.state.weatherData.main.temp + ' \u2103'} (max: { this.state.weatherData.main.temp_max + ' \u2103'})
              </Text>
            </Text>
            <Text style={ styles.textLeft} >
              <Text style={ styles.subheader }>Feels Like: </Text>
              <Text style={ styles.paragraph }>{ this.state.weatherData.main.feels_like + ' \u2103'}</Text>
            </Text>
            <Text style={ styles.textLeft} >
              <Text style={ styles.subheader }>Humidty: </Text>
              <Text style={ styles.paragraph }>{ this.state.weatherData.main.humidity + ' %'}</Text>
            </Text>
            <Text style={ styles.textLeft} >
              <Text style={ styles.subheader }>Pressure: </Text>
              <Text style={ styles.paragraph }>{ this.state.weatherData.main.pressure + ' hPa'}</Text>
            </Text>
            <Text style={ styles.textLeft} >
              <Text style={ styles.subheader }>Wind Speed: </Text>
              <Text style={ styles.paragraph }>
                { this.state.weatherData.wind.speed + ' m/s'}
              </Text>
            </Text>
            <Text style={ styles.textLeft} >
              <Text style={ styles.subheader }>Cloudiness: </Text>
              <Text style={ styles.paragraph }>
                { this.state.weatherData.clouds.all + ' % Cloudy'} 
              </Text>
            </Text>
          </View>
          <View style={ { flex: 1, justifyContent: 'center', width: '100%' } }>
            <Button 
              title="Click to Update Data" 
              color="green" hardwareAccelerated 
              onPress={ () => this.updateData() }
              />
          </View>
        </View>
      </View>
    )
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 40,
    paddingBottom: 40
  },
  card: {
    borderWidth: 1,
    
    borderColor: '#c5c5c5',
    width: '100%',
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textLeft: {
    textAlign: 'left'
  },
  header: {
    fontWeight: 'bold',
    fontSize: 28
  },
  subheader: {
    fontWeight: 'bold',
    fontSize: 20
  },
  paragraph: {
    fontSize: 16,
  },
  weatherIcon: {
    height: 75,
    width: 75,
    margin: 1,
    borderWidth: 1,
    borderColor: "#c5c5c5",
    backgroundColor: "#f5f5f5",
    borderRadius: 50
  },
  
});
