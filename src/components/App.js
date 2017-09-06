import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends React.Component{
	constructor(){
		super();

		this.addFish = this.addFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
		// initial state
		this.state = {
			fishes: {},
			order: {}
		};
	}

  componentWillMount(){
    // runs right before the App is redered
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });

    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`)
    
    if(localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      })
    }
  }

  componentWillUnmount(){
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState){
    localStorage.setItem(`order-${this.props.params.storeId}`, 
      JSON.stringify(nextState.order));

  }

	addFish(fish){
		// update state
		const fishes = {...this.state.fishes}; //... is spread
		//add the new fish
		const timestamp = Date.now(); //for a key
		fishes[`fish-${timestamp}`] = fish;
		//set state
		this.setState({ fishes: fishes });

	}

  updateFish(key, updatedFish) {
    const fishes = {...this.state.fishes};
    fishes[key] = updatedFish;
    this.setState({ fishes });

  }

  removeFish(key){
    const fishes = {...this.state.fishes};
    fishes[key] = null;
    this.setState({ fishes });

  }

  loadSamples(){
    this.setState({
      fishes: sampleFishes
    })
  }

  addToOrder(key) {
    // take a copy of state
    const order = {...this.state.order};
    //add new
    order[key] = order[key] + 1 || 1;
    //update state
    this.setState({order});
  }

  removeFromOrder(key) {
    const order = {...this.state.order};
    delete order[key];
    this.setState({order});

  }

	render(){
		return(
			<div className="catch-of-the-day">	
				<div className="menu">
					<Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
            { Object
              .keys(this.state.fishes) 
              .map(key => <Fish key={key} index={key} details={this.state.fishes[key]}
                addToOrder={this.addToOrder}/>)
              }
              {/*key es predeterminada y no se puede acceder en un hijo, index es una prop random*/}
          </ul>
				</div>
				<Order 
        fishes={this.state.fishes} 
        order={this.state.order}
        params={this.props.params}
        removeFromOrder={this.removeFromOrder}/>
				<Inventory 
        fishes={this.state.fishes} 
        addFish={this.addFish} 
        loadSamples={this.loadSamples}
        updateFish={this.updateFish}
        removeFish={this.removeFish}
        storeId={this.props.params.storeId}
        />
			</div>

		)
	}
}

export default App;