import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, ActivityIndicator, TouchableHighlight } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
export default class Home extends Component {
  constructor() {
    super()

    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0,
      loading: true,
      activeAddress: true,
      activeCalendar: false,
      activeInfo: false,
      activePhone: false,
      activeLock: false,
    }

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-30deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    })

  }
  componentWillMount() {
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {

        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {

        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start()
        }
      }
    })
  }

  componentDidMount() {
    fetch(`https://randomuser.me/api/0.4/?randomapi`)
      .then(res => res.json())
      .then(json => this.setState({ data: json, loading: false }));
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.currentIndex !== this.state.currentIndex) {
      this.setState({ loading: true })
      fetch(`https://randomuser.me/api/0.4/?randomapi`)
        .then(res => res.json())
        .then(json => this.setState({ data: json, loading: false }));
    }
  }

  renderUsers = () => {
    if (this.state.data) {
      return this.state.data.results.map((item, i) => {
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.seed} style={[this.rotateAndTranslate, { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 10000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>

            </Animated.View>

            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 10000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>

            </Animated.View>
            <View>
              <View style={{ height: '30%', backgroundColor: '#E5E5E5', zIndex: 1000, borderBottomColor: '#E5E5E5', borderBottomWidth: 1 }}>
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'stretch',
                }}>
                  <Image

                    style={{ width: 200, height: 200, position: 'absolute', top: 30, borderRadius: 100, borderColor: 'white', borderWidth: 5, resizeMode: 'cover' }}
                    source={{ uri: item.user.picture }} />
                </View>
              </View>
              <View style={{ height: '70%', backgroundColor: 'white', borderTopColor: '#DDD', borderTopWidth: 1 }}>
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'stretch',
                }}>
                  {this.renderBottomIcon(item)}
                </View>
              </View>
            </View>

          </Animated.View>
        )
      }).reverse()
    }
  }

  renderBottomIcon = (item) => {
    const { activeInfo, activeCalendar, activeAddress, activePhone, activeLock } = this.state;
    if (activeInfo === true && activeCalendar === false && activeAddress === false && activePhone === false && activeLock === false) {
      return <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
      }}>
        <View style={{ position: 'absolute', top: 120 }}>
          <Text style={{ fontSize: 18, fontWeight: '400', textAlign: 'center' }}>My Information</Text>
        </View>
        <View style={{ position: 'absolute', top: 150 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', textAlign: 'center' }}>{item.user.email}</Text>
        </View>
      </View>
    }

    if (activeInfo === false && activeCalendar === true && activeAddress === false && activePhone === false && activeLock === false) {
      return <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
      }}>
        <View style={{ position: 'absolute', top: 120 }}>
          <Text style={{ fontSize: 18, fontWeight: '400', textAlign: 'center' }}>My Calendar</Text>
        </View>
        <View style={{ position: 'absolute', top: 150 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', textAlign: 'center' }}>{item.user.SSN}</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', textAlign: 'center' }}>{item.user.cell}</Text>
        </View>
      </View>
    }

    if (activeInfo === false && activeCalendar === false && activeAddress === true && activePhone === false && activeLock === false) {
      return <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
      }}>
        <View style={{ position: 'absolute', top: 120 }}>
          <Text style={{ fontSize: 18, fontWeight: '400', textAlign: 'center' }}>My address is</Text>
        </View>
        <View style={{ position: 'absolute', top: 150 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', textAlign: 'center' }}>{item.user.location.street}</Text>
        </View>
      </View>
    }

    if (activeInfo === false && activeCalendar === false && activeAddress === false && activePhone === true && activeLock === false) {
      return <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
      }}>
        <View style={{ position: 'absolute', top: 120 }}>
          <Text style={{ fontSize: 18, fontWeight: '400', textAlign: 'center' }}>My phone number</Text>
        </View>
        <View style={{ position: 'absolute', top: 150 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', textAlign: 'center' }}>{item.user.phone}</Text>
        </View>
      </View>
    }

    if (activeInfo === false && activeCalendar === false && activeAddress === false && activePhone === false && activeLock === true) {
      return <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
      }}>
        <View style={{ position: 'absolute', top: 120 }}>
          <Text style={{ fontSize: 18, fontWeight: '400', textAlign: 'center' }}>My Lock</Text>
        </View>
        <View style={{ position: 'absolute', top: 150 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', textAlign: 'center' }}>{item.user.salt}</Text>
        </View>
      </View>
    }
  }

  onClickPerson = () => {
    this.setState({
      activeInfo: true,
      activeCalendar: false,
      activeAddress: false,
      activePhone: false,
      activeLock: false,
    })
  }

  onClickCalendar = () => {
    this.setState({
      activeInfo: false,
      activeCalendar: true,
      activeAddress: false,
      activePhone: false,
      activeLock: false,
    })
  }

  onClickAddress = () => {
    this.setState({
      activeInfo: false,
      activeCalendar: false,
      activeAddress: true,
      activePhone: false,
      activeLock: false,
    })
  }

  onClickPhone = () => {
    this.setState({
      activeInfo: false,
      activeCalendar: false,
      activeAddress: false,
      activePhone: true,
      activeLock: false,
    })
  }

  onClickLock = () => {
    this.setState({
      activeInfo: false,
      activeCalendar: false,
      activeAddress: false,
      activePhone: false,
      activeLock: true,
    })
  }
  render() {
    return (
      <View style={styles.mainviewStyle}>
        <View style={{ flex: 1 }}>
          <View style={{ height: 60 }}>
          </View>
          <View style={{ flex: 1 }}>
            {this.state.loading ? <ActivityIndicator /> : this.renderUsers()}
          </View>
        </View>
        <View>
          <View style={styles.footer}>
            <TouchableHighlight style={styles.bottomButtons} onPress={this.onClickPerson}>
              <Image
                key={`imagePerson`}
                source={require('./icon/outline_person_outline_black_24dp.png')}
                style={{ width: 40, height: 40, position: 'absolute', tintColor: `${this.state.activeInfo ? 'red' : '#DDD'}` }}
              />
            </TouchableHighlight>
            <TouchableHighlight style={styles.bottomButtons} onPress={this.onClickCalendar}>
              <Image
                key={`imageCalendar`}
                source={require('./icon/outline_calendar_today_black_24dp.png')}
                style={{ width: 35, height: 35, position: 'absolute', tintColor: `${this.state.activeCalendar ? 'red' : '#DDD'}` }}
              />
            </TouchableHighlight>
            <TouchableHighlight style={styles.bottomButtons} onPress={this.onClickAddress}>
              <Image
                key={`imageMap`}
                source={require('./icon/outline_map_black_24dp.png')}
                style={{ width: 40, height: 40, position: 'absolute', tintColor: `${this.state.activeAddress ? 'red' : '#DDD'}` }}
              />
            </TouchableHighlight>
            <TouchableHighlight style={styles.bottomButtons} onPress={this.onClickPhone}>
              <Image
                key={`imagePhone`}
                source={require('./icon/outline_phone_black_24dp.png')}
                style={{ width: 40, height: 40, position: 'absolute', tintColor: `${this.state.activePhone ? 'red' : '#DDD'}` }}
              />
            </TouchableHighlight>
            <TouchableHighlight style={styles.bottomButtons} onPress={this.onClickLock}>
              <Image
                key={`imageLock`}
                source={require('./icon/outline_lock_black_24dp.png')}
                style={{ width: 40, height: 40, position: 'absolute', tintColor: `${this.state.activeLock ? 'red' : '#DDD'}` }}
              />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainviewStyle: {
    flex: 1,
    flexDirection: 'column'
  },
  footer: {
    paddingLeft: 50,
    paddingRight: 50,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    height: 80,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  bottomButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 18,
  },
  textStyle: {
    alignSelf: 'center',
    color: 'orange'
  },
})