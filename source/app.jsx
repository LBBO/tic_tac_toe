import React, {Component} from "react";
import Gamefield from "./Gamefield.jsx";

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			gameIsRunning: false,
			gameField: null
		};

		this.beginningPlayer = undefined;

		this.renderBottom = this.renderBottom.bind(this);
		this.renderTitle = this.renderTitle.bind(this);
		this.abort = this.abort.bind(this);
		this.startGame = this.startGame.bind(this);
		this.forceRender = this.forceRender.bind(this);
		this.win = this.win.bind(this);
	}
	
	renderTitle() {
		return (
			<div className="header">
				<span className="title">TICK TACK</span>
				{this.state.gameIsRunning ? <span className="abort" onClick={this.abort}>ABORT</span> : null}
			</div>
		);
	}

	renderBottom() {
		if (!this.state.gameIsRunning) {
			return (
				<div className="footer">
					<span className="newGame" onClick={this.startGame}>NEW GAME</span>
				</div>
			);
		} else {
			return (
				<div className="footer">
					<span className="userTurn">{this.state.gameField.state.currentPlayer.svg}s TURN</span>
				</div>
			);
		}
	}
	
	abort() {
		this.state.gameIsRunning = false;
		this.state.gameField.init(this.beginningPlayer);
		this.forceRender();
	}
	
	startGame() {
		this.state.gameIsRunning = true;
		this.state.gameField.init(this.beginningPlayer);
		this.state.gameField.start();
		this.forceRender();
	}

	forceRender() {
		this.setState(this.state);
	}

	win() {
		this.state.gameIsRunning = false;

		//Verlierer soll anfangen, bei Unentschieden derjenige, der diese Runde nicht begonnen hat
		switch(this.state.gameField.state.winner.name) {
			case 'X':
				this.beginningPlayer = this.state.gameField.playerO;
				break;
			case 'O':
				this.beginningPlayer = this.state.gameField.playerX;
				break;
			default:
				this.beginningPlayer = this.state.gameField.state.currentPlayer;
				break;
		}

		this.forceRender();
	}

	render() {
		return (
			<div className={'game ' + (this.state.gameIsRunning ? 'gameIsRunning' : 'gameIsNotRunning')}>
				{this.renderTitle()}
				{(this && this.state.gameField && this.state.gameField.state.isWon) ?
					<div className="winScreen">
						<span className="winner">{
							this.state.gameField.state.winner.svg == '' ? 'NOBODY' : this.state.gameField.state.winner.svg
						}</span>
						<aside>WON THE GAME</aside>
					</div>
					:null
				}
				
				<Gamefield
					ref={(gameField) => {this.state.gameField = gameField;}}
					onTileClick={this.forceRender}
					onWin={this.win}
				>

				</Gamefield>
				{this.renderBottom()}
			</div>
		);
	}
}
