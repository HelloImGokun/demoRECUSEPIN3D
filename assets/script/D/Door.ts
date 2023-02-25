import { _decorator, CCBoolean, Collider, Component,  ITriggerEvent,  Node,  tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Door')
export class Door extends Component {
    @property(Node)
    private door:Node = null;
    @property({type:CCBoolean})
    private isNPC:boolean = false;
    @property(Node)
    private standPointNode:Node = null;
    public openDoor(){
        tween(this.door).by(0.5,{eulerAngles:new Vec3(0,90,0)}).start(); 

    }
    public getIsNPC(){
        return this.isNPC;
    }
    public getStandPoint(){
        return this.standPointNode.worldPosition;
    }
    public rescueNPC(){
        
    }
}

