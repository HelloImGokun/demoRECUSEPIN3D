import { _decorator, CCBoolean, Collider, Component,  ITriggerEvent,  Node,  tween, Vec3 } from 'cc';
import { NCP } from '../N/NCP';
const { ccclass, property } = _decorator;

@ccclass('Door')
export class Door extends Component {
    @property(Node)
    private door:Node = null;
    @property(Node)
    private standPointNode:Node = null;
    @property(NCP)
    private npc:NCP = null;
    public openDoor(){
        if(this.npc==null){
            tween(this.door).by(0.5,{eulerAngles:new Vec3(0,90,0)}).start(); 
        }else{
            //npc
            tween(this.door).by(0.5,{eulerAngles:new Vec3(0,-90,0)}).start(); 
        }


    }
    public getIsNPC(){
        return this.npc!=null;
    }
    public getStandPoint(){
        return this.standPointNode.worldPosition;
    }
    public rescueNPC(){
        if(this.npc){
            this.npc.wave();
        }
    }
}

