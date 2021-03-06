import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

import  { connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {updateObject, checkValidity} from '../../shared/utility'


class Auth extends Component {
    state = {
        controls: {
            email:{
                elementType:'input',
                elementConfig:{
                    type:'email',
                    placeholder:'Mail Address'
                },
                value:'',
                validation:{
                    required:true,
                    isEmail: true
                },
                valid:false,
                touched:false
            },
            password:{
                elementType:'input',
                elementConfig:{
                    type:'password',
                    placeholder:'Password'
                },
                value:'',
                validation:{
                    required:true,
                    minLength: 6
                },
                valid:false,
                touched:false
            }
        },
        isSignUp: true
    }

    componentDidMount(){
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/' ){
            this.props.onSetAuthRedirectPath()
        }

    }


    inputChangedHandler = (event, controlName) => {

        const updatedControls = updateObject(this.state.controls, {
            [controlName]: updateObject(this.state.controls[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value,this.state.controls[controlName].validation),
                touched: true
            })
        })
        this.setState({controls:updatedControls});

    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value,this.state.controls.password.value,this.state.isSignUp)

    }

    switchAuthHandler =() => {
        this.setState(prevState => {
            return {isSignUp: !prevState.isSignUp};
        })
    }

    render () {
        const formElement=[];
    for (let key in this.state.controls){
        formElement.push({
            id:key,
            config:this.state.controls[key]
        });
    }

    let form = formElement.map(formele => (
        <Input 
            key= {formele.id}
            elementType={formele.config.elementType} 
            elementConfig={formele.config.elementConfig} 
            invalid={!formele.config.valid}
            shouldValidate={formele.config.validation}
            touched={formele.config.touched}
            value={formele.config.value}
            changed={(event)=>this.inputChangedHandler(event, formele.id)} />
          ));

        if(this.props.loading) {
            form = <Spinner/>
        }

        let errorMessage = null;
        if(this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            )
        }
        let authredirect =null
        if(this.props.isAuth){
            authredirect = <Redirect to={this.props.authRedirectPath}/>
        }

        return (
            <div className={ classes.Auth}>
                {authredirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType='Success'> Submit </Button>
                </form>
                 <Button 
                 clicked={this.switchAuthHandler}
                 btnType='Danger'>SWITCH TO {this.state.isSignUp ? 'Sign In' : 'Sign Up'}</Button>
            </div>


        )

    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error:state.auth.error,
        isAuth: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email,password, isSignUp) => dispatch(actions.auth(email,password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirect('/'))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Auth); 