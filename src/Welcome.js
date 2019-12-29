import React, { Component, useState, useEffect } from 'react'
import { Modal, StyleSheet, Text, Image, TextInput, View, Keyboard, TouchableOpacity, FlatList, TouchableWithoutFeedback, Alert, Dimensions } from 'react-native'
import * as firebase from "firebase";
import Carousel from 'react-native-snap-carousel';

const WelcomeScreen=({ navigation }) => {
  const [NameResto, setNameResto] = useState("");
  const [IdResto, setIdResto] = useState("");
  const [Search, setSearch] = useState("");
  const [ModalSte, setModalSte] = useState(false);
  const [Restos, setResto] = useState({});
  
  useEffect(() => {
    const db = firebase.firestore();

    const unsubcribe = db.collection("Restos").onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (["added", "modified"].includes(change.type)) {
          //if (change.type === "added" || change.type === "modified") {
          setResto(values => ({
            ...values,
            [change.doc.id]: change.doc.data()
          }));
        }
        if (change.type === "removed") {
          setResto(values => {
            const temp = { ...values };
            delete temp[change.doc.id];

            return temp;
          });
        }
      });
    });

    return function cleanup() {
      unsubcribe();
    };
  }, []);

  const BuscarResto = () => {
    if (Object.keys(Restos).filter(key => Restos[key].Name.includes(Search)).length == 0) {
       Alert.alert('The Grand at Moon Palace', 'Not found')
    }
  }

  const reservarResto = () => {
    const db = firebase.firestore();

    console.log(NameResto);
    console.log(IdResto);

    db.collection('Reservas').add({
      Resto: NameResto,
      ID: IdResto,
      Date: firebase.firestore.FieldValue.serverTimestamp()
    });
  };
  
  const renderItem = (Name) => {
    console.log(Name, 'entre');
    return (
      <View style={styles.Card}>
          <Text style={styles.title}>{ Name }</Text>
      </View>
    );
  };



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Carousel
              ref={(c) => { carousel = c; }}
              data={Object.keys(Restos)}
              renderItem={( {item:key} ) => {return <View style={styles.Card} title={Restos[key].ID}>
                                                      <Image source={{uri:Restos[key].img? Restos[key].img: ''}} style={styles.stretch}/>    
                                                      <Text style={styles.Title}> {Restos[key].subtitle} </Text>
                                                      <View style={styles.contenedorAcciones}>
                                                        <TouchableOpacity
                                                          style={[styles.btnReserve]}
                                                          onPress={() => {
                                                            setNameResto(Restos[key].Name);
                                                            setIdResto(Restos[key].ID);
                                                            reservarResto();
                                                          }}
                                                          >
                                                          <Text style={styles.textButton}>Reservar</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                          style={[styles.btnReserve]}
                                                          onPress={() => {
                                                            setNameResto(Restos[key].Name);
                                                            console.log(NameResto);
                                                          }}
                                                        >
                                                          <Text style={styles.textButton}>Calificar</Text>
                                                        </TouchableOpacity>
                                                      </View>
                                                    </View>}
              }
              sliderWidth={Dimensions.get('window').width}
              itemWidth={300}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 400,
    backgroundColor: '#000',
    justifyContent: 'flex-start',
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  
  stretch: {
    hight: 500,
    width: 300,
    resizeMode: 'contain',
  },

  Title: {
    fontSize: 16,
    color: '#A9733E',
  },

  btnReserve: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: '#A9733E',
    padding: 10,
    alignItems: 'center',
  },

  textButton: {
    color: '#FFF',
    fontSize: 14,
  },
  
  contenedorAcciones: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },

  Time: {
    alignItems: 'center',
    fontSize: 16,
    width: 100
  },
  
  Card: {
    marginTop: 10,
    height: 500,
    borderRadius: 25,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#161616',
    padding: 10,
    shadowColor: '#A9733E',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    
    elevation: 7,
  }
  
})

export default WelcomeScreen;
