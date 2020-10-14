import React ,{Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
import * as burgerBuilderActions from '../../store/actions/index'


class BurgerBuilder extends Component{
    
    state = {
        purchasing:false,
    }
    componentDidMount(){
        this.props.onInitIngredients();
        
    }
    updatePurchaseState = (ingredients) =>{
       
        const sum = Object.keys(ingredients)
            .map(igkey => {
                return ingredients[igkey]
            })
            .reduce((sum,el)=>{
                return sum+el;
            },0);

        return sum > 0 ;
    }

    purchaseHandler = () => {
        if(this.props.isAuth) {
            this.setState({purchasing:true})
        }
        else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }  
    }

    purchaseCancelHandler =() =>{
        this.setState({purchasing:false})
    }

    purchaseContinueHandler = () => {

        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }



    render(){
        const disableInfo = {
            ...this.props.ings
        };
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0
        }
        let orderSummary = null;
        let burger =this.props.error ? <p>Ingredient Can't be loaded</p> : <Spinner/>;

        if(this.props.ings){
        burger =(
            <Aux>
            <Burger ingredients={this.props.ings}/>
            <BuildControls  
                ingredientAdded = {this.props.onIngredientAdded}
                ingredientRemoved = {this.props.onIngredientRemoved}
                disabled={disableInfo}
                price={this.props.price}
                purchaseable={this.updatePurchaseState(this.props.ings)}
                isAuth={this.props.isAuth}
                ordered={this.purchaseHandler}/>
            </Aux>
        );
        orderSummary = <OrderSummary ingredients = {this.props.ings}
        price = {this.props.price}
        purchaseCancelled = {this.purchaseCancelHandler}
        purchaseContinued = {this.purchaseContinueHandler}/>
        }

        if(this.state.loading){
            orderSummary = <Spinner />
        }
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>

                {burger}
            </Aux>

        );
    }
}

const mapStateToProps = state =>{
    return {
        ings:state.burgerBuilder.ingredients,
        price:state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuth: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredients(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredients(ingName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
        onInitPurchase: () => dispatch(burgerBuilderActions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(burgerBuilderActions.setAuthRedirect(path))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));