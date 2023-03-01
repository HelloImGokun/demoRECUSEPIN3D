import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Playerdata')
export class Playerdata extends Component {
    public static GAME_ID = 'game_id';

    public static saveStorage(key,value){
        sys.localStorage.setItem(key+Playerdata.GAME_ID,value);
    }
    public static getStorage(key){
        return sys.localStorage.getItem(key+Playerdata.GAME_ID);
    }
}


