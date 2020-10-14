import React,{Component} from 'react';
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.module.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import {connect} from 'react-redux'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../../store/actions/index'
import { updateObject, checkValidity } from '../../../shared/utility';

class ContactData extends Component {
    state ={
        orderForm:{
                name:{
                    elementType:'input',
                    elementConfig:{
                        type:'text',
                        placeholder:'Your Name'
                    },
                    value:'',
                    validation:{
                        required:true
                    },
                    valid:false,
                    touched:false
                },

                street:{
                    elementType:'input',
                    elementConfig:{
                        type:'text',
                        placeholder:'Street'
                    },
                    value:'',
                    validation:{
                        required:true
                    },
                    valid:false,
                    touched:false
                },
                zipcode:{
                    elementType:'input',
                    elementConfig:{
                        type:'text',
                        placeholder:'zip code'
                    },
                    value:'',
                    validation:{
                        required:true,
                        minLength:5,
                        maxLength:5
                    },
                    valid:false,
                    touched:false
                },
                country:{
                    elementType:'input',
                    elementConfig:{
                        type:'text',
                        placeholder:'country'
                    },
                    value:'',
                    validation:{
                        required:true
                    },
                    valid:false,
                    touched:false
                },
                email:{
                    elementType:'input',
                    elementConfig:{
                        type:'email',
                        placeholder:'email'
                    },
                    value:'',
                    validation:{
                        required:true
                    },
                    valid:false,
                    touched:false
                },
                deliveryMethod: {
                    elementType:'select',
                    elementConfig:{
                        options:[
                            {value:'fastest',displayValue:'Fastest'},
                            {value:'cheapest',displayValue:'Cheapest'}
                        ]
                    },
                    value:'fastest',
                    validation:{},
                    valid:true
                },
        },
        formIsValid:false
    }

    orderHandler = (event) => {
        event.preventDefault();

        const formData = {};
        
        for (let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier]= this.state.orderForm[formElementIdentifier].value;
        }

        const order ={
            ingredients:this.props.ings,
            price:this.props.price.toFixed(2),
            orderData:formData,
            userId:this.props.userId
        }

        this.props.onOrderBurger(order, this.props.token);

    }

    inputChangedHandler =(event, inputIdentifer)=>{
    
        const updatedelement= updateObject(this.state.orderForm[inputIdentifer],{
            value:event.target.value,
            valid: checkValidity(event.target.value,this.state.orderForm[inputIdentifer].validation),
            touched: true
        });
        const updatedform = updateObject(this.state.orderForm,{
            [inputIdentifer]: updatedelement
        })
        let formIsValid=true;
        for(let inputIdentifer in updatedform) {
            formIsValid = updatedform[inputIdentifer].valid && formIsValid
        }
        this.setState({orderForm:updatedform,formIsValid:formIsValid})
    }

render() {
    const formElement=[];
    for (let key in this.state.orderForm){
        formElement.push({
            id:key,
            config:this.state.orderForm[key]
        });
    }


    let form = (
    <form onSubmit={this.orderHandler}>
       {formElement.map(formele=>(
            <Input
            key ={formele.id}  
            elementType={formele.config.elementType} 
            elementConfig={formele.config.elementConfig} 
            invalid={!formele.config.valid}
            shouldValidate={formele.config.validation}
            touched={formele.config.touched}
            value={formele.config.value}
            changed={(event)=>this.inputChangedHandler(event, formele.id)}/>
       ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>Order</Button>
    </form>);
    if(this.props.loading){
        form = <Spinner />;
    }
    return(
        <div className={classes.ContactData}>
            <h4>Enter your Contact Data</h4>
            {form}

        </div>
    )
}
}

const mapStateToProps= state => {
    return{
        ings: state.burgerBuilder.ingredients,
        price:state.burgerBuilder.totalPrice,
        loading:state.order.loading,
        token:state.auth.token,
        userId:state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onOrderBurger: (orderData,token) => dispatch(actions.purchaseBurger(orderData, token))
    }
    
}
export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData,axios));