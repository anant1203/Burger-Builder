import * as actionTypes from './actionsTypes';
import axios from '../../axios-orders';


export const addIngredients =(name) =>{
    return{
        type:actionTypes.ADD_INGREDIENTS,
        ingredientName:name
    };
};

export const removeIngredients =(name) =>{
    return{
        type:actionTypes.REMOVE_INGREDIENT,
        ingredientName:name
    };
};

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENT,
        ingredients:ingredients
    };
};

export const fetchingredientfailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    }
}

export const initIngredients = () => {
    return dispatch => {
        axios.get('https://react-my-burger-9c8b9.firebaseio.com/ingredients.json')
            .then(response => {
                dispatch(setIngredients(response.data))
            })
            .catch(error => 
                dispatch(fetchingredientfailed()));
    };
};