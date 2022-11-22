import { tokenStore } from '@stores/tokenStore';
import axios from 'axios';

const { getState } = tokenStore;

const tokenAxios = axios.create();

const publicAxios = axios.create();
