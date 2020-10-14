import React, { Component } from 'react';

import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button'


class OrderSummary extends Component {

    render(){

        const ingredientsSummary = Object.keys(this.props.ingredients)
        .map(igkeys => {
            return(
            <li key={igkeys}>
                <span style={{textTransform: 'capitalize'}}>
                    {igkeys}</span>: {this.props.ingredients[igkeys]}
            </li>

        )});
        return(
            <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the following ingredients:</p>
            <ul>
                {ingredientsSummary}
            </ul>
            <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
            <p>Continue to checkout</p>
            <Button btnType="Danger" clicked={this.props.purchaseCancelled}>Cancel</Button>
            <Button btnType="Success" clicked={this.props.purchaseContinued}>Continue</Button>

        </Aux>

        )
    }
}

export default OrderSummary;