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
        {/* <Text style={styles.UserName}>{navigation.state.params.Name.substring(0, 10) + ' ' + navigation.state.params.LastName.substring(0, 10)}</Text>
        <Text style={styles.UserNameInitial}>{navigation.state.params.Name.substring(0, 1) + navigation.state.params.LastName.substring(0, 1)}</Text> */}
        {/* <TextInput key="Search" 
                   style={styles.Buscador} 
                   placeholder="Type here the name of resto..." 
                   value={Search} 
                   onChangeText={(text) => setSearch(text)} 
                  onKeyPress={BuscarResto}/> */}

        <Carousel
              ref={(c) => { carousel = c; }}
              data={Object.keys(Restos)}
              renderItem={( {item:key} ) => {return <View style={styles.Card} title={Restos[key].ID}>
                                                      <Image source={{uri:Restos[key].img !== undefined? Restos[key].img: ''}} style={styles.stretch}/>    
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
                                                          <Text style={color='#FFF'}>Reservar</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                          style={[styles.btnReserve]}
                                                          onPress={() => {
                                                            setNameResto(Restos[key].Name);
                                                            console.log(NameResto);
                                                          }}
                                                        >
                                                          <Text style={color='#FFF'}>Calificar</Text>
                                                        </TouchableOpacity>
                                                      </View>
                                                    </View>}
              }
              sliderWidth={Dimensions.get('window').width}
              itemWidth={300}
        />

        {/* <FlatList
          data={Object.keys(Restos).filter(key => Restos[key].Name.includes(Search))}
          renderItem={( {item:key} ) => {return <View title={Restos[key].id}>
                                                  <TouchableOpacity
                                                    style={[styles.item]}
                                                    onPress={() => {
                                                      setNameResto(Restos[key].Name);
                                                      setIdResto(Restos[key].ID);
                                                      setModalSte(!ModalSte);
                                                    }}
                                                    >
                                                    <Text style={styles.Title}>{Restos[key].Name}</Text>
                                                    <Text style={styles.Time}>{Restos[key].WaitTime}</Text>
                                                  </TouchableOpacity>
                                                </View>}}
          keyExtractor={key => Restos[key].id}
        /> 
        
        <Modal
          animationType="slide"
          transparent={true}
          visible={ModalSte}
          onRequestClose={() => {
            setModalSte(!ModalSte);
          }}>
            <View style={{marginTop: 200}}>
              <View style={styles.Modal}>

                <Text style={styles.Title}>{NameResto}</Text>
                
                <TouchableOpacity
                  onPress={() => {
                    reservarResto();
                    setModalSte(!ModalSte);
                  }}>
                    <Text style={styles.Title}>reserv</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setModalSte(!ModalSte);
                  }}>
                    <Text style={styles.Title}>Rank</Text>
                </TouchableOpacity>

              </View>
            </View>
        </Modal> */}

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
// Modal: {
  //   height: 500,
  //   width: 340,
//   marginLeft: 10,
//   marginRight: 10,
//   backgroundColor: '#FFF',
//   padding: 10,
//   shadowColor: '#A9733E',
//   shadowOffset: {
  //     width: 0,
  //     height: 3,
  //   },
  //   shadowOpacity: 0.29,
//   shadowRadius: 4.65,

//   elevation: 7,
// },

// item: {
//   flex: 1,
//   flexDirection: 'row',
//   backgroundColor: '#FFF',
//   padding: 10,
//   width: 300,
// },

// UserName: {
  //   width: 210,
//   height: 50,
//   borderRadius: 25,
//   backgroundColor: '#D3D3D3',
//   color: '#FFF',
//   fontSize: 14,
//   textAlign: 'center',
//   paddingTop: 15,
//   paddingLeft: 25,
// }, 

// Buscador: {
//   margin: 15,
//   width: 300,
//   marginBottom: 10,
//   borderBottomWidth: 1,
//   borderBottomColor: '#259D97',
//   justifyContent: 'center',
// },

  
// UserNameInitial: {
//   width: 50,
//   height: 50,
//   borderRadius: 25,
//   backgroundColor: '#259D97',
//   color: '#FFF',
//   fontSize: 20,
//   fontWeight: 'bold',
//   textAlign: 'center',
//   paddingTop: 10,
//   marginTop: -50,
// },