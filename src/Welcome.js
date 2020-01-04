import React, { Component, useState, useEffect } from 'react'
import { Modal, StyleSheet, Text, View, Keyboard, 
         TouchableOpacity, ImageBackground, Dimensions, ScrollView} from 'react-native'
import { Card, Icon } from 'react-native-elements';
import * as firebase from "firebase";
import Carousel from 'react-native-snap-carousel';

const WelcomeScreen=({ navigation }) => {
  const [NameResto, setNameResto] = useState("");
  const [IdResto, setIdResto] = useState("");
  const [Restos, setResto] = useState({});
  
  // firebase
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

  // reservas
  const reservarResto = () => {
    const db = firebase.firestore();

    db.collection('Reservas').add({
      Resto: NameResto,
      ID: IdResto,
      Date: firebase.firestore.FieldValue.serverTimestamp()
    });
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={Object.keys(Restos)}
        renderItem={( {item:key} ) => <ImageBackground key={Restos[key].ID} style={styles.imgBackGroundCard} source={{uri:Restos[key].backGround? Restos[key].backGround: ''}}>
                                        <Card containerStyle={styles.card} image={{uri:Restos[key].img}} >
                                          <Text style={styles.title}>{Restos[key].subtitle}</Text>
                                          <Text style={styles.time}>{Restos[key].WaitTime}</Text>
                                          <View style={styles.divider}></View>
                                          <ScrollView style={styles.scroll}>
                                            <Text style={styles.data}>{Restos[key].data}</Text>
                                          </ScrollView>
                                          <View style={styles.contenedorAcciones}>
                                            <TouchableOpacity style={[styles.btnReserve]} onPress={() => {
                                              setNameResto(Restos[key].Name);
                                              setIdResto(Restos[key].ID);
                                              reservarResto();
                                            } }>
                                              <Text style={styles.textButton}>Reservar</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={[styles.btnReserve]} onPress={() => {
                                              setNameResto(Restos[key].Name);
                                              setIdResto(Restos[key].ID);
                                              console.log(NameResto, IdResto);
                                            } }>
                                              <Text style={styles.textButton}>Calificar</Text>
                                            </TouchableOpacity>
                                          </View>
                                      </Card>
                                    </ImageBackground>
                      }
        keyExtractor={item => item.ID}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 10,
    padding: 0,
    backgroundColor: '#000',
  },

  title: {
    fontSize: 16,
    color: '#A9733E',
  },

  btnReserve: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: '#A9733E',
    padding: 10,
    alignItems: 'center',
    margin: 5,
  },

  contenedorAcciones: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },

  time: {
    fontSize: 14,
    width: 100,
    color: '#FFF'
  },

  divider: {
    height: 1,
    width: 150,
    boderColor: '#A9733E'
  },

  scroll: {
    height: 150
  },

  data: {
    fontSize: 12,
    color: '#FFF',
  },

  card: {
    zIndex: 999999999,
    backgroundColor: '#161616',
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
    padding: 10,
    shadowColor: '#A9733E',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.7,
    elevation: 7,
    padding: 0,
    opacity: 1,
    borderColor: 'transparent',
    marginBottom: 10
  },
  
  imgBackGroundCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    opacity: 0.5
  }  

})

export default WelcomeScreen;
