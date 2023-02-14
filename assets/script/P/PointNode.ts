import { _decorator, CCBoolean, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PointNode')
export class PointNode extends Component {
    @property({type:Boolean})
    private isLock:boolean;
    start() {

    }
    getIsLock(){
        return this.isLock;
    }
    setUnlock(){
        this.isLock = false;
    }
    getPosition(){
        return this.node.position;
    }
}


