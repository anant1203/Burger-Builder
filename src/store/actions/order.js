import * as actionTypes from './actionsTypes';
import axios from '../../axios-orders';
export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId:id,
        orderData:orderData
    }
}

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    }
}

export const purchaseBurgerStart = () => {
    return {
        type:actionTypes.PURCHASE_BURGER_START
    }
}

export const purchaseBurger = (orderData, token) => {
    return dispatch =>{
        dispatch(purchaseBurgerStart());
        axios.post('/orders.json?auth='+token,orderData)
        .then(response => {
            dispatch(purchaseBurgerSuccess(response.data.name,orderData))
        })
        .catch(error => {
            dispatch(purchaseBurgerFail( error ));
        });

    }
}

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    }
}

export const fetchordersuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDER_SUCCESS,
        orders:orders
    }
}

export const fetchorderfails = (error) => {
    return {
        type: actionTypes.FETCH_ORDER_FAIL,
        error: error
    }
}

export const fetchorderstart = () => {
    return {
        type: actionTypes.FETCH_ORDER_START
    };
}

export const fetchorder =(token,userId) => {
    return dispatch => {
        dispatch(fetchorderstart());
        const queryParams ='?auth='+token + '&orderBy="userId"&equalTo="'+userId+'"';
        axios.get('/orders.json'+queryParams)
        .then(res =>{
            const fetchData=[];
            for(let key in res.data){
                fetchData.push({
                    ...res.data[key],
                    id:key
                });
            }
            dispatch(fetchordersuccess(fetchData));
        })
        .catch(err => {
            dispatch(fetchorderfails(err));
        })
    }
}

