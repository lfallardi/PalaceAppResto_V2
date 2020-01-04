import React, { Component, useState, useEffect, Children } from 'react'
import { Modal, StyleSheet, Text, View, Keyboard, 
         TouchableOpacity, ImageBackground, Dimensions, ScrollView} from 'react-native'
import { Card, Icon } from 'react-native-elements';
import * as firebase from "firebase";
import Carousel from 'react-native-snap-carousel';
import blurImg from '../assets/blur.jpg'

const WelcomeScreen=({ navigation }) => {
  const [NameResto, setNameResto] = useState("");
  const [CurrentItem, setCurrentItem] = useState(0);
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
  const reservarResto = (Resto) => {
    const db = firebase.firestore();

    db.collection('Reservas').add({
      Resto: Resto.Name,
      ID: Resto.ID,
      Date: firebase.firestore.FieldValue.serverTimestamp()
    });
  };
  
  const calificarResto = (Resto) => {
    const db = firebase.firestore();

    db.collection('Calificaciones').add({
      Resto: Resto.Name,
      ID: Resto.ID,
      Calidad: 5,
      Date: firebase.firestore.FieldValue.serverTimestamp()
    });
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={Object.keys(Restos)}
        renderItem={( {item:key, index} ) => <CarrouselItem Resto={Restos[key]} CurrentItem={CurrentItem} Index={index} key={Restos[key].ID} 
                                                            uri={Restos[key].backGround} onReservar={Resto => reservarResto(Resto)}
                                                            onCalificar={Resto => calificarResto(Resto)}/>
                      }
        keyExtractor={item => item.ID}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width}
        onSnapToItem = {(index) => {
          setCurrentItem(index)
        }}
      />
    </View>
  )
}


const CarrouselItem = ({Resto, uri, CurrentItem, Index, onReservar, onCalificar}) => {
  return <ImageBackground style={styles.imgBackGroundCard} defaultSource={blurImg} source={CurrentItem === Index && uri? {uri}: blurImg}><View style={styles.overlay}>
          <Card containerStyle={styles.card} image={{uri:Resto.img}} >
            <Text style={styles.title}>{Resto.subtitle}</Text>
            <Text style={styles.time}>{Resto.WaitTime}</Text>
            <View style={styles.divider}/>
            <ScrollView style={styles.scroll}>
              <Text style={styles.data}>{Resto.data}</Text>
            </ScrollView>
            
            <View style={styles.contenedorAcciones}>
              <TouchableOpacity style={[styles.btnReserve]} onPress={() => {
                if (onReservar) { onReservar(Resto) } 
                } }>
                <Text style={styles.textButton}>Reservar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btnReserve]} onPress={() => {
                if (onCalificar) { onCalificar(Resto) } 
                } }>
                <Text style={styles.textButton}>Calificar</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ImageBackground>
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
    borderBottomColor: '#A9733E'
  },

  scroll: {
    height: 150,
    marginTop: 5,
    paddingTop: 5,
    borderTopColor: '#A9733E',
    lineHeight: 14,
    borderTopWidth: 2,
    marginBottom: 60
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
    // opacity: 1,
    borderColor: 'transparent',
    marginBottom: 10
  },
  
  overlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },

  imgBackGroundCard: {
    flex: 1,
    // opacity: 0.5
  }  

})

export default WelcomeScreen;
