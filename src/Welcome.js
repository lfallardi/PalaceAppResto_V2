import React, { Component, useState, useEffect } from 'react'
import { Modal, StyleSheet, Text, TextInput, View, Keyboard, TouchableOpacity, FlatList, TouchableWithoutFeedback, Alert } from 'react-native'
import * as firebase from "firebase";

// const dtResto = [
//   {
//     id: '1',
//     title: 'Boulangerie',
//     WaitTime: 'none'
//   },
//   {
//     id: '2',
//     title: 'Caribeño',
//     WaitTime: 'none'
//   },
//   {
//     id: '3',
//     title: 'Cielito Lindo',
//     WaitTime: 'none'
//   },
//   {
//     id: '4',
//     title: 'Cusco',
//     WaitTime: 'none'
//   },
//   {
//     id: '5',
//     title: 'Habibi',
//     WaitTime: 'none'
//   },
//   {
//     id: '6',
//     title: 'Jade',
//     WaitTime: 'none'
//   },
//   {
//     id: '7',
//     title: 'JC Stakehouse',
//     WaitTime: 'none'
//   },
//   {
//     id: '8',
//     title: 'La Cantina by Cielito Lindo',
//     WaitTime: 'none'
//   },
//   {
//     id: '9',
//     title: 'Le Chateau',
//     WaitTime: 'none'
//   },
//   {
//     id: '10',
//     title: 'Lobby Bar',
//     WaitTime: 'none'
//   },
//   {
//     id: '11',
//     title: 'Los Tacos',
//     WaitTime: 'none'
//   },
//   {
//     id: '12',
//     title: 'Lounge Bar Caribeño Terrace',
//     WaitTime: 'none'
//   },
//   {
//     id: '13',
//     title: 'Lounge Bar Cusco Terrace',
//     WaitTime: 'none'
//   },
//   {
//     id: '14',
//     title: 'Snack La Selva',
//     WaitTime: 'none'
//   },
//   {
//     id: '15',
//     title: 'Swim Up Bar Caribeño',
//     WaitTime: 'none'
//   },
//   {
//     id: '16',
//     title: 'Swim Up Bar Cusco',
//     WaitTime: 'none'
//   },
//   {
//     id: '17',
//     title: 'Tavola',
//     WaitTime: 'none'
//   },
//   {
//     id: '18',
//     title: 'Tapas y Vinos',
//     WaitTime: 'none'
//   },
//   {
//     id: '19',
//     title: 'The Grand Buffet',
//     WaitTime: 'none'
//   },
//   {
//     id: '20',
//     title: 'The Grill Snack Bar',
//     WaitTime: 'none'
//   },
//   {
//     id: '21',
//     title: 'The Grill Swim Up Bar',
//     WaitTime: 'none'
//   },
//   {
//     id: '22',
//     title: 'The Ninth Pin Bowlin & Bar',
//     WaitTime: 'none'
//   },
//   {
//     id: '23',
//     title: 'The Library Speakeasy Bar',
//     WaitTime: 'none'
//   },
// ];

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

          // objeto que se genera en tareas
          // {
          //   "zG9CgjoHvKTqIiBWZpf8": {
          //     titulo: "",
          //     fecha: "",
          //     done: false
          //   },
          //   "zG9CgjoHvKTtIiBWZpf8": {
          //     titulo: "",
          //     fecha: "",
          //     done: false
          //   }
          // }
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

    db.collection('Reservas').add({
      Resto: NameResto,
      ID: IdResto,
      Date: firebase.firestore.FieldValue.serverTimestamp()
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.UserName}>{navigation.state.params.Name.substring(0, 10) + ' ' + navigation.state.params.LastName.substring(0, 10)}</Text>
        <Text style={styles.UserNameInitial}>{navigation.state.params.Name.substring(0, 1) + navigation.state.params.LastName.substring(0, 1)}</Text>
        <TextInput key="Search" 
                   style={styles.Buscador} 
                   placeholder="Type here the name of resto..." 
                   value={Search} 
                   onChangeText={(text) => setSearch(text)} 
                   onKeyPress={BuscarResto}/>

        <FlatList
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
        </Modal>

      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 400,
    backgroundColor: '#FFF',
    justifyContent: 'flex-start',
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  
  UserName: {
    width: 210,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D3D3D3',
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    paddingTop: 15,
    paddingLeft: 25,
  }, 
  
  UserNameInitial: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#259D97',
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
    marginTop: -50,
  },
  
  Buscador: {
    margin: 15,
    width: 300,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#259D97',
    justifyContent: 'center',
  },

  item: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 10,
    width: 300,
  },

  Title: {
    fontSize: 16,
    width: 200
  },

  Time: {
    alignItems: 'center',
    fontSize: 16,
    width: 100
  },

  Modal: {
    height: 500,
    width: 340,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#FFF',
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