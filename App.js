//import React from 'react';
import { useState, useEffect } from 'react'
//import React from 'react';
//import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Countdown from './Countdown.js'

const App = () => {

 //states
  const [timer, setTimer] = useState("03:00");
    const [running, setRunning] = useState(true)
    const [button, setButton] = useState("Start")


return (
    <>
      <Countdown
    timer={timer}
    setTimer={setTimer}
    running={running}
    setRunning={setRunning}
    button={button}
    setButton={setButton}
      />

    </>
  )

}

export default App;
