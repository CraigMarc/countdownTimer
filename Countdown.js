import { useState, useEffect, useRef } from 'react'
import Sound from 'react-native-sound';
//keeps app awake all the time
//import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import { activateKeepAwake, deactivateKeepAwake } from "@sayem314/react-native-keep-awake";

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Button,
    Pressable,
} from 'react-native';

// sound code

var buzzer = new Sound('buzzer.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
    // when loaded successfully
    //console.log('duration in seconds: ' + buzzer.getDuration() + 'number of channels: ' + buzzer.getNumberOfChannels());
});

buzzer.setVolume(1);

// keep awake functions



var styles = StyleSheet.create({

    title: {
        fontWeight: 'bold',
        fontSize: 45,
        textAlign: 'center',
        paddingBottom: 20,
        paddingTop: 10,
        marginBottom: 60,

    },

    timer: {
        fontSize: 80,
        textAlign: 'center',
        marginBottom: 50,
    },

    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#24A0ed',
        width: 200,
        marginBottom: 40,

    },

    startContainer: {
        alignItems: 'center',
    },

    timeControl: {
        alignItems: 'center',
    },

    text: {
        fontSize: 20,
        color: 'white',
    },

});


const Countdown = (props) => {

    //keeps app awake all the time
    //useKeepAwake();

    const {

        timer,
        setTimer,
        running,
        setRunning,
        button,
        setButton,


    } = props;

    // var to disable buttons
    let disable = false

    // keep awake and when timer is running

    if (button == "Stop") {
        activateKeepAwake();

    }

    if (button == "Start" || button == "Reset") {
        deactivateKeepAwake();

    }

    // disable buttons when timer is running or done

    if (button == "Stop" || button == "Reset") {
        disable = true

    }

    if (button == "Start") {
        disable = false
    }




    // We need ref in this, because we are dealing
    // with JS setInterval to keep track of it and
    // stop it when needed
    const Ref = useRef(null);
    const startTime = useRef(180)


    //const getTimeRemaining = (time) => {
    function getTimeRemaining(time) {

        const total =
            Date.parse(time) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor(
            (total / 1000 / 60) % 60
        );

        return {
            total,
            minutes,
            seconds,
        };
    };

    const startTimer = (time) => {


        let { total, minutes, seconds } =
            getTimeRemaining(time);
        if (total >= 0) {
            // update the timer
            // check if less than 10 then we need to
            // add '0' at the beginning of the variable
            setTimer(

                (minutes > 9
                    ? minutes
                    : "0" + minutes) +
                ":" +
                (seconds > 9 ? seconds : "0" + seconds)
            );
        }

        if (total == 0) {
            setButton("Reset")
            buzzer.play(success => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });

        }
    };

    const clearTimer = (time) => {
        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next
        if (startTime.current / 60 > 9) {
            setTimer(startTime.current / 60 + ":00");
        }
        else {
            setTimer("0" + startTime.current / 60 + ":00");
        }
        // If you try to remove this line the
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(time);
        }, 1000);
        Ref.current = id;

        //stop timer
        if (running == false) {
            clearInterval(id)
        }
    };

    const getDeadTime = () => {

        let deadline = new Date();

        // This is where you need to adjust if
        // you entend to add more time
        deadline.setSeconds(deadline.getSeconds() + startTime.current);
        return deadline;
    };


    const onClickReset = () => {

        if (running == true) {
            setRunning(false)
            setButton("Stop")

        }
        else {
            setRunning(true)
            setButton("Start")


        }
        if (button == "Reset") {
            buzzer.stop()

        }

        clearTimer(getDeadTime());
    };

    const onClickIncrease = () => {

        startTime.current = startTime.current + 60

        let minutes = startTime.current / 60
        if (startTime.current / 60 > 9) {
            setTimer(minutes + ":00")
        }
        else {
            setTimer("0" + minutes + ":00")
        }
    };

    const onClickDecrease = () => {
        if (startTime.current != 60) {
            startTime.current = startTime.current - 60
        }
        let minutes = startTime.current / 60
        if (startTime.current / 60 > 9) {
            setTimer(minutes + ":00")
        }
        if (startTime.current / 60 <= 9) {
            setTimer("0" + minutes + ":00")
        }



    };


    return (
        <View>
            <Text
                style={styles.title}
            >
                Gym Timer
            </Text>
            <View style={styles.timeControl}>
                <Pressable
                    onPress={onClickIncrease}
                    style={styles.button}
                    disabled={disable}
                >
                    <Text style={styles.text}>Increase</Text>
                </Pressable>

                <Pressable
                    onPress={onClickDecrease}
                    style={styles.button}
                    disabled={disable}
                >
                    <Text style={styles.text}>Decrease</Text>
                </Pressable>
            </View>
            <Text style={styles.timer}>{timer}</Text>
            <View style={styles.startContainer}>
                <Pressable
                    onPress={onClickReset}
                    style={styles.button}
                >
                    <Text style={styles.text}>{button}</Text>
                </Pressable>
            </View>
        </View>
    );

};



export default Countdown;