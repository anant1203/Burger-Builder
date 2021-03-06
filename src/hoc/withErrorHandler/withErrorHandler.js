import React, { Component } from 'react'
import Modal from '../../components/UI/Modal/Modal'
import Aux from '../Aux/Aux'



const withErrorHandler = (WrappedComponent,axios) => {
    return class extends Component {
        state={
            error:null
        }

        componentWillMount(){
            this.reqInter = axios.interceptors.response.use(req  =>{
                this.setState({error:null})
                return req;
            });

            this.resInter = axios.interceptors.response.use(res => res, error =>{
                this.setState({error:error})
            });
        }

        componentWillUnmount(){
            axios.interceptors.request.eject(this.reqInter);
            axios.interceptors.request.eject(this.resInter);
        }

        errorConfirmedHandler =()=>{
            this.setState({error:null})
        }

        render () {
        return(
            <Aux>
                <Modal show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                    {this.state.error ? this.state.error.message : null}
                </Modal>
                <WrappedComponent {...this.props} />
            </Aux>
        );
    }
  }
}

export default withErrorHandler;