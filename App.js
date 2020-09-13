import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import params from './src/params';

import MineField from './src/components/MineField';
import { createMinedBoard, cloneBoard, openField, hasExplosion, wonGame, showMines, invertFlag, flagsUsed } from './src/functions';
import Header from './src/components/Header';
import LevelSelection from './src/screens/LevelSelection';


export default class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = this.createState()
  }

  minesAmount = () => {
    const rows = params.getRowsAmount()
    const columns = params.getColumnsAmount()
    return Math.ceil(rows*columns*params.difficultLevel)
  }

  createState = () => {
    const rows = params.getRowsAmount()
    const columns = params.getColumnsAmount()
    return {
      board: createMinedBoard(rows, columns, this.minesAmount()),
      won: false,
      lost: false,
      showLevelSelection: false
    }
  }
  
  onOpenField = (row, column) => {
    const board = cloneBoard(this.state.board)
    openField(board, row, column)
    const lost = hasExplosion(board)
    const won = wonGame(board)

    if(lost){
      showMines(board)
      Alert.alert('Perdeu!',':(')
    }

    if(won){
      Alert.alert('Parabéns', ' Vc venceu!')
    }

    this.setState({ board, lost, won });
  }

  onSelectField = (row, column) => {
    const board = cloneBoard(this.state.board)
    invertFlag(board, row, column)
    const won = wonGame(board)

    if(won){
      Alert.alert('Parabéns', ' Vc venceu!')
    }

    this.setState({ board, won });
  }

  onLevelSelected = level => {
    params.difficultLevel = level
    this.setState(this.createState());
  }

  render() {
    return (
      <View style={styles.container}>
        <LevelSelection isVisible={this.state.showLevelSelection} onLevelSelected={this.onLevelSelected}
          onCancel={() => this.setState({ showLevelSelection: false })}/>

        <Header flagsLeft={this.minesAmount() - flagsUsed(this.state.board)} 
            onNewGame={() => this.setState(this.createState())} 
            onFlagPress={() => this.setState({ showLevelSelection: true})}/>
        
        <View style={styles.board}>
          <MineField board={this.state.board}  onOpenField={this.onOpenField} onSelectField={this.onSelectField}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  welcome: {

  },
  instructions: {

  },
  board: {
    alignItems: 'center',
    backgroundColor: '#AAA'
  }
});
